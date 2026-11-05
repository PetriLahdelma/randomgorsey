import { cardResponse, currentServerCard } from "@/lib/server-cards";

const contentType = "application/mcp-server-card+json";
export function GET() { return cardResponse(currentServerCard, contentType); }
export function HEAD() { return cardResponse(currentServerCard, contentType, true); }
