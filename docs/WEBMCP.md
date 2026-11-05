# WebMCP journal tool

Browsers implementing the current WebMCP draft receive one optional, read-only tool named `list_random_gorsey_journal`.

The tool returns bounded metadata for public journal entries from the existing `/api/posts/` endpoint. It accepts a zero-based `offset` and a `limit` from 1 to 12. Results include canonical post URLs so agents can cite the public source.

The tool is feature-detected. Browsers without `document.modelContext.registerTool` receive no registration code, UI change, console message, or polyfill. It does not expose contact submission, booking, playback, payment, or other state-changing actions.

WebMCP remains a draft Community Group Report, so this integration should be revisited when the specification or browser implementation changes.
