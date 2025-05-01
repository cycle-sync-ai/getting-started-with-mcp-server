# hello-mcp: MCP Server with Custom Tools

A Model Context Protocol (MCP) server demonstrating resources, prompts, and dynamic tools that LLMs can call. This example is based on Part 4 of the "Building MCP Servers" tutorial by Christopher Strolia-Davis.

## Prerequisites

- Node.js >= 16
- npm or yarn

## Installation

```bash
# Clone repo (or start from scratch)
git clone <your-repo-url> hello-mcp
cd hello-mcp
npm install
```

## Project Structure

```
src/
  resources.ts           # Static resource definitions
  resource-templates.ts  # Template-based resources
  prompts.ts             # Custom LLM prompts
  tools.ts               # Tool schemas & handlers (create-message)
  handlers.ts            # MCP request handlers (resources, prompts, tools)
  index.ts               # Server init & transport setup
build/                   # Compiled output (via tsc)
```

## Adding Tools

1. **Define** tool interface in `src/tools.ts`:
   ```ts
   export const tools = {
     "create-message": {
       name: "create-message",
       description: "Generate a custom message",
       inputSchema: {
         /* messageType, recipient, tone */
       },
     },
   };
   ```
2. **Implement** handler logic:
   ```ts
   export const toolHandlers = {
     "create-message": createMessage,
   };
   ```
3. **Wire** into handlers in `src/handlers.ts`:
   ```ts
   server.setRequestHandler(ListToolsRequestSchema, () => ({
     tools: Object.values(tools),
   }));
   server.setRequestHandler(CallToolRequestSchema, (req) =>
     toolHandlers[req.params.name](req.params)
   );
   ```
4. **Enable** tools capability in `src/index.ts`:
   ```ts
   const server = new Server(
     { name: "hello-mcp", version: "1.0.0" },
     {
       capabilities: { resources: {}, prompts: {}, tools: {} },
     }
   );
   ```

## Build & Run

```bash
npm run build          # transpile TS to JS
node build/index.js    # start MCP server over stdio
```

## Testing

### Inspector

```bash
npx @modelcontextprotocol/inspector node build/index.js
```

- Open the **Tools** tab
- Select `create-message`
- Try e.g.:
  ```json
  { "messageType": "thank-you", "recipient": "Alice", "tone": "playful" }
  ```

### Using with an LLM

Authorize tool usage if prompted, then ask:

- "Create a greeting message for Bob"
- "Send a playful thank you to Alice"
- "What kinds of messages can you create?"

## Further Reading

- MCP Protocol Docs: https://modelcontextprotocol.io/docs
- Full tutorial series on Medium by Christopher Strolia-Davis

---

_MIT License_
