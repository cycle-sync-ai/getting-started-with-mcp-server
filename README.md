# Building MCP Servers: Part 2 — Extending Resources with Resource Templates

This README summarizes Part 2 of the “Building MCP Servers” tutorial by Christopher Strolia-Davis. In this step we extend our server’s capabilities using **resource templates**.

## Table of Contents

- [What are Resource Templates?](#what-are-resource-templates)
- [Why Use Resource Templates?](#why-use-resource-templates)
- [Adding the New Resource](#adding-the-new-resource)
- [Handler Organization](#handler-organization)
- [Template Definition](#template-definition)
- [Template Handling](#template-handling)
- [Testing with the Inspector](#testing-with-the-inspector)
- [Testing with Claude Desktop](#testing-with-claude-desktop)
- [What’s Next?](#whats-next)
- [Sources & Additional Reading](#sources--additional-reading)

---

## What are Resource Templates?

Resource templates allow you to define dynamic resources using URI patterns. Unlike static resources with fixed URIs, templates let you generate content on demand based on parameters.

## Why Use Resource Templates?

- Handle dynamic data dynamically
- Generate content on demand
- Create parameter-based resources

## Adding the New Resource

In `src/handlers.ts`, add a `ListResourceTemplatesRequestSchema` handler:

```ts
server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => ({
  resourceTemplates: [
    {
      uriTemplate: "greetings://{name}",
      name: "Personal Greeting",
      description: "A personalized greeting message",
      mimeType: "text/plain",
    },
  ],
}));
```

Then extend the `ReadResourceRequestSchema` handler to match templates:

```ts
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const greetingExp = /^greetings:\/\/(.+)$/;
  const match = request.params.uri.match(greetingExp);
  if (match) {
    const name = decodeURIComponent(match[1]);
    return {
      contents: [
        {
          uri: request.params.uri,
          text: `Hello, ${name}! Welcome to MCP.`,
        },
      ],
    };
  }
  // existing static handler...
});
```

## Handler Organization

- `ListResourcesRequestSchema` → static resources
- `ReadResourceRequestSchema` → static resource content
- `ListResourceTemplatesRequestSchema` → available templates
- `ReadResourceRequestSchema` → dynamic template handling

## Template Definition

Templates follow [RFC 6570](https://www.rfc-editor.org/rfc/rfc6570) syntax. Metadata includes:

- `uriTemplate`
- `name`
- `description`
- `mimeType`

## Template Handling

Use a regex to extract parameters from the URI and generate dynamic content in the handler.

## Testing with the Inspector

```bash
npx @modelcontextprotocol/inspector node build/index.js
```

1. Open **Resource Templates** tab
2. Select **Personal Greeting**
3. Try:

```json
{ "name": "Alice" }
```

Expect:

```json
{
  "contents": [
    {
      "uri": "greetings://Alice",
      "text": "Hello, Alice! Welcome to MCP."
    }
  ]
}
```

## Testing with Claude Desktop

```bash
npx tsc
```

Test resources and templates in MCP-aware tools (e.g., Cline).

## What’s Next?

In Part 3, we’ll add **prompt** capabilities to our MCP server.

## Sources & Additional Reading

- [Building MCP Servers: Part 2 — Extending Resources with Resource Templates](https://medium.com/@cstroliadavis/building-mcp-servers-315917582ad1)
- [RFC 6570](https://www.rfc-editor.org/rfc/rfc6570)
