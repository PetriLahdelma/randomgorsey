# Personal Agent Protocol discovery

`/.well-known/poppy.json` implements the discovery document from the
[Personal Agent Protocol draft 0.4](https://personalagentprotocol.org/docs/0.4/spec).

The document exposes only capabilities that already exist publicly:

- `web: {}` means a personal agent may browse the website as an ordinary
  signed-out visitor. No browser-session endpoint is offered.
- `apis` points to the read-only OpenAPI description for the public journal
  archive and the read-only MCP endpoint for journal entries and releases.
- `skill_index` embeds the canonical Agent Skills discovery index. The route
  imports that JSON artifact directly so its URL and digest cannot drift from
  the separately published well-known index.

The site does not publish an authorization server, protected-resource
metadata, account scopes, a company agent, conversations, browser-session
joining, booking, contact submission, payment, or commerce capabilities.
Requests to the public journal API do not use or trust `Poppy-Session` claims.

Poppy is still a draft. Recheck this isolated route and its contract tests
before adopting a later protocol version.
