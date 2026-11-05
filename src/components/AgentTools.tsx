"use client";

import { useEffect } from "react";

import { toAbsoluteSiteUrl } from "@/config/site";

type AgentToolInput = {
  limit?: number;
  offset?: number;
};

type AgentToolExecutionOptions = {
  signal: AbortSignal;
};

type AgentToolDefinition = {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown>;
  annotations: {
    readOnlyHint: boolean;
    untrustedContentHint: boolean;
    consequentialHint: boolean;
  };
  execute: (
    input: AgentToolInput,
    options: AgentToolExecutionOptions
  ) => Promise<JournalIndexResult>;
};

type ModelContext = {
  registerTool: (
    tool: AgentToolDefinition,
    options: { signal: AbortSignal }
  ) => Promise<void>;
};

type DocumentWithModelContext = Document & {
  modelContext?: ModelContext;
};

type PublicPost = {
  category?: string;
  excerpt?: string;
  id: number;
  timestamp: string;
  title: string;
};

type JournalIndexResult = {
  limit: number;
  nextOffset: number | null;
  offset: number;
  posts: Array<{
    category: string | null;
    excerpt: string | null;
    id: number;
    published: string;
    title: string;
    url: string;
  }>;
  totalPosts: number;
};

const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 12;

const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    offset: {
      type: "integer",
      minimum: 0,
      default: 0,
      description: "Zero-based offset into the public journal archive.",
    },
    limit: {
      type: "integer",
      minimum: 1,
      maximum: MAX_LIMIT,
      default: DEFAULT_LIMIT,
      description: "Number of entries to return, from 1 to 12.",
    },
  },
} as const;

const outputSchema = {
  type: "object",
  required: ["offset", "limit", "totalPosts", "nextOffset", "posts"],
  additionalProperties: false,
  properties: {
    offset: { type: "integer", minimum: 0 },
    limit: { type: "integer", minimum: 1, maximum: MAX_LIMIT },
    totalPosts: { type: "integer", minimum: 0 },
    nextOffset: { type: ["integer", "null"], minimum: 0 },
    posts: {
      type: "array",
      maxItems: MAX_LIMIT,
      items: {
        type: "object",
        required: [
          "id",
          "title",
          "published",
          "category",
          "excerpt",
          "url",
        ],
        additionalProperties: false,
        properties: {
          id: { type: "integer" },
          title: { type: "string" },
          published: { type: "string" },
          category: { type: ["string", "null"] },
          excerpt: { type: ["string", "null"] },
          url: { type: "string", format: "uri" },
        },
      },
    },
  },
} as const;

function readInteger(
  value: unknown,
  fallback: number,
  name: string,
  minimum: number,
  maximum?: number
): number {
  if (value === undefined) return fallback;
  if (
    !Number.isSafeInteger(value) ||
    (value as number) < minimum ||
    (maximum !== undefined && (value as number) > maximum)
  ) {
    const range = maximum === undefined ? `${minimum} or greater` : `${minimum} to ${maximum}`;
    throw new TypeError(`${name} must be an integer from ${range}.`);
  }
  return value as number;
}

function combinedSignals(
  first: AbortSignal,
  second: AbortSignal
): { dispose: () => void; signal: AbortSignal } {
  if (first.aborted) return { signal: first, dispose: () => {} };
  if (second.aborted) return { signal: second, dispose: () => {} };

  const controller = new AbortController();
  const abort = () => controller.abort();
  first.addEventListener("abort", abort, { once: true });
  second.addEventListener("abort", abort, { once: true });
  return {
    signal: controller.signal,
    dispose: () => {
      first.removeEventListener("abort", abort);
      second.removeEventListener("abort", abort);
    },
  };
}

export function createJournalIndexTool(lifetimeSignal: AbortSignal): AgentToolDefinition {
  return {
    name: "list_random_gorsey_journal",
    title: "List Random Gorsey journal entries",
    description:
      "Lists public Random Gorsey journal entries with canonical source URLs. This tool is read-only and does not submit messages, bookings, playback actions, or purchases.",
    inputSchema,
    outputSchema,
    annotations: {
      readOnlyHint: true,
      untrustedContentHint: true,
      consequentialHint: false,
    },
    async execute(input = {}, options) {
      const offset = readInteger(input.offset, 0, "offset", 0);
      const limit = readInteger(input.limit, DEFAULT_LIMIT, "limit", 1, MAX_LIMIT);
      const combined = combinedSignals(lifetimeSignal, options.signal);
      let response: Response;
      try {
        response = await fetch(
          `/api/posts/?offset=${offset}&limit=${limit}`,
          { signal: combined.signal }
        );
      } finally {
        combined.dispose();
      }

      if (!response.ok) {
        throw new Error(`The public journal API returned HTTP ${response.status}.`);
      }

      const payload = (await response.json()) as {
        posts?: PublicPost[];
        totalPosts?: number;
      };
      if (!Array.isArray(payload.posts) || !Number.isSafeInteger(payload.totalPosts)) {
        throw new Error("The public journal API returned an invalid response.");
      }

      const totalPosts = payload.totalPosts as number;
      return {
        offset,
        limit,
        totalPosts,
        nextOffset: offset + payload.posts.length < totalPosts
          ? offset + payload.posts.length
          : null,
        posts: payload.posts.slice(0, limit).map((post) => ({
          id: post.id,
          title: post.title,
          published: post.timestamp,
          category: post.category ?? null,
          excerpt: post.excerpt?.slice(0, 240) ?? null,
          url: toAbsoluteSiteUrl(`/posts/${post.id}/`),
        })),
      };
    },
  };
}

export default function AgentTools() {
  useEffect(() => {
    const modelContext = (document as DocumentWithModelContext).modelContext;
    if (!modelContext?.registerTool) return;

    const controller = new AbortController();
    void modelContext
      .registerTool(createJournalIndexTool(controller.signal), {
        signal: controller.signal,
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          console.warn("WebMCP journal tool registration failed", error);
        }
      });

    return () => controller.abort();
  }, []);

  return null;
}
