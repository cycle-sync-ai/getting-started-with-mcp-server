# Building MCP Servers: Part 3 — Adding Prompts

This README summarizes Part 3 of the “Building MCP Servers” tutorial by Christopher Strolia-Davis. In this step we refactor our code to add **prompt** capabilities to our MCP server.

## Table of Contents

- [What are MCP Prompts?](#what-are-mcp-prompts)
- [Why Use Prompts?](#why-use-prompts)
- [Adding Prompts](#adding-prompts)
- [Module Organization](#module-organization)
- [Prompt Structure](#prompt-structure)
- [Message Sequences](#message-sequences)
- [Testing with the Inspector](#testing-with-the-inspector)
- [Testing with Claude Desktop](#testing-with-claude-desktop)
- [What’s Next?](#whats-next)
- [Sources & Additional Reading](#sources--additional-reading)

---

## What are MCP Prompts?

Prompts are structured templates that your server provides to standardize interactions with LLMs. Unlike resources (data) or tools (actions), prompts define **reusable message sequences** and can accept arguments to customize the interaction.

## Why Use Prompts?

- Enforce consistent, reusable LLM-interaction patterns
- Simplify prompt engineering by centralizing templates
- Share and version your most-used prompts

### Examples

- **Code Review**

  ```text
  name -> code-review
  Please review the following {{language}} code focusing on {{focusAreas}}:
  ```

- **Data Analysis**

  ```text
  name -> analyze-sales-data
  Analyze {{timeframe}} sales data focusing on {{metrics}}
  ```

- **Content Generation**
  ```text
  name -> generate-email
  Generate a {{tone}} {{type}} email for {{context}}
  ```

---

## Adding Prompts

1. **Define prompts & handlers** in `src/prompts.ts`

   ```ts
   // src/prompts.ts
   export const prompts = {
     "create-greeting": {
       name: "create-greeting",
       description: "Generate a customized greeting message",
       arguments: [
         {
           name: "name",
           description: "Name of the person to greet",
           required: true,
         },
         {
           name: "style",
           description:
             "Greeting style: formal, excited, or casual. Defaults to casual",
         },
       ],
     },
   };

   export const promptHandlers = {
     "create-greeting": ({
       name,
       style = "casual",
     }: {
       name: string;
       style?: string;
     }) => ({
       messages: [
         {
           role: "user",
           content: {
             type: "text",
             text: `Please generate a greeting in ${style} style to ${name}.`,
           },
         },
       ],
     }),
   };
   ```

2. **Wire up handlers** in `src/handlers.ts`

   ```ts
   // src/handlers.ts
   import {
     ListPromptsRequestSchema,
     GetPromptRequestSchema,
   } from "@modelcontextprotocol/sdk/types.js";
   import { promptHandlers, prompts } from "./prompts.js";

   export const setupHandlers = (server: Server): void => {
     // ... other resources
     server.setRequestHandler(ListPromptsRequestSchema, () => ({
       prompts: Object.values(prompts),
     }));

     server.setRequestHandler(GetPromptRequestSchema, (request) => {
       const { name, arguments: args } = request.params;
       const handler = promptHandlers[name as keyof typeof promptHandlers];
       if (!handler) throw new Error("Prompt not found");
       return handler(args as any);
     });
   };
   ```

3. **Enable prompts** in `src/index.ts`

   ```ts
   // src/index.ts
   import { Server } from "@modelcontextprotocol/sdk/server/index.js";
   import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
   import { setupHandlers } from "./handlers.js";

   const server = new Server(
     { name: "hello-mcp", version: "1.0.0" },
     { capabilities: { prompts: {}, resources: {} } }
   );

   setupHandlers(server);
   // … transport setup
   ```

---

## Module Organization

- `prompts.ts` → definitions + handlers
- `handlers.ts` → routing layer for resources & prompts
- `index.ts` → server init & capabilities

---

## Prompt Structure

- **name** – unique identifier
- **description** – human-readable purpose
- **arguments** – list of named inputs (with `required` flag)
- **handler** – function that builds an array of `{ role, content }` messages

---

## Message Sequences

- Prompts return an object with a `messages: [{ role, content }]` array
- Supports multi-step workflows, though with limited orchestration

---

## Testing with the Inspector

```bash
npx @modelcontextprotocol/inspector node build/index.js
```

1. Open **Prompts** tab
2. Select `create-greeting`
3. Try:
   ```json
   { "name": "Alice", "style": "excited" }
   ```
4. Expect:
   ```json
   {
     "messages": [
       {
         "role": "user",
         "content": {
           "type": "text",
           "text": "Please generate a greeting in excited style to Alice."
         }
       }
     ]
   }
   ```

---

## Testing with Claude Desktop

1. Compile your server:
   ```bash
   npx tsc
   ```
2. [Set up Claude Desktop integration](https://medium.com/@cstroliadavis/building-mcp-servers-536969d27809).
3. In Claude Desktop:
   - Click **Attach from MCP** → **Choose an integration** → `hello-mcp:create-greeting`
   - Enter `John` for **name**, leave **style** blank → Submit
   - Inspect the generated prompt in chat

---

## What’s Next?

In [Part 4](https://medium.com/@cstroliadavis/building-mcp-servers-f9ce29814f1f) we will:

- Add **MCP Tools** (dynamic actions)
- Compare tools vs prompts
- Complete our greeting server

---

## Sources & Additional Reading

- [MCP Prompts](https://modelcontextprotocol.io/docs/concepts/prompts)
- [unichat-mcp-server](https://github.com/amidabuddha/unichat-mcp-server)
- [Claude Prompt Engineering](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)
- [10 Prompt Engineering Best Practices](https://dev.to/get_pieces/10-prompt-engineering-best-practices-23dk)
- [Prompting Guide](https://promptingguide.ai)
