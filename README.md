# Building MCP Servers: Part 1 — Getting Started with Resources

This tutorial walks you through setting up a basic MCP (Model Context Protocol) server to expose read-only resources to Large Language Models (LLMs) like Claude. You’ll learn what MCP is, why resources are useful, and how to initialize a Node.js/TypeScript project with the `@modelcontextprotocol/sdk`.

## Table of Contents

- [What is Model Context Protocol?](#what-is-model-context-protocol)
- [What are MCP Resources?](#what-are-mcp-resources)
- [Why Use Resources?](#why-use-resources)
- [Example Servers](#example-servers)
  - [Documentation Server](#documentation-server)
  - [Log Analysis Server](#log-analysis-server)
  - [Customer Data Server](#customer-data-server)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Project Setup](#project-setup)
- [Next Steps](#next-steps)
- [MCP Tools (Dynamic Actions)](#mcp-tools-dynamic-actions)
- [Tools vs Prompts](#tools-vs-prompts)
- [Complete Our Greeting Server](#complete-our-greeting-server)
- [Sources & Additional Reading](#sources--additional-reading)
- [License](#license)

## What is Model Context Protocol?

The Model Context Protocol (MCP) is a standardized interface that allows LLMs to safely interact with external data and services. With MCP, you can expose files, databases, APIs, and more to your AI models in a controlled manner.

## What are MCP Resources?

Resources are read-only endpoints that expose content (text or binary) via a unique URI. Examples include:

- `file:///path/to/file.txt`
- `database://users/123`
- `api://weather/latest`

Each resource has metadata like a display name and MIME type.

## Why Use Resources?

Resources enable LLMs to:

- Read files and databases
- Execute commands
- Access APIs
- Interact with local tools

All interactions require explicit user permission, ensuring security and auditability.

## Example Servers

### Documentation Server

Expose your documentation:

```txt
docs://api/reference     → API documentation
docs://guides/getting-started  → User guides
```

### Log Analysis Server

Serve system logs:

```txt
logs://system/today      → Today's logs
logs://errors/recent     → Recent error messages
```

### Customer Data Server

Provide customer insights:

```txt
customers://profiles/summary   → Customer overview
customers://feedback/recent    → Latest feedback
```

## Getting Started

### Prerequisites

- Node.js (>= 16)
- npm (>= 8)
- TypeScript

### Installation

```bash
mkdir hello-mcp
cd hello-mcp
npm init -y
npm install @modelcontextprotocol/sdk
npm install -D typescript @types/node
```

### Project Setup

1. Update `package.json`:

   ```json
   {
     "name": "hello-mcp",
     "version": "1.0.0",
     "type": "module",
     "scripts": {
       "build": "tsc",
       "test": "echo \"Error: no test specified\" && exit 1"
     },
     "dependencies": {
       "@modelcontextprotocol/sdk": "^1.1.0"
     },
     "devDependencies": {
       "typescript": "^5.7.2",
       "@types/node": "^22.10.5"
     }
   }
   ```

2. Create `tsconfig.json`:

   ```json
   {
     "compilerOptions": {
       "target": "ES2022",
       "module": "Node16",
       "moduleResolution": "Node16",
       "outDir": "./build",
       "rootDir": "./src",
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "forceConsistentCasingInFileNames": true
     },
     "include": ["src/**/*"]
   }
   ```

3. Create a `src/` directory and start coding your MCP server.

## Next Steps

Check out Part 2 for configuring transports and advanced features.

## MCP Tools (Dynamic Actions)

MCP Tools (also called dynamic actions) let you define custom functions that the LLM can call during a session, extending MCP’s capabilities beyond static resources.

## Tools vs Prompts

| Aspect      | MCP Tools               | Prompts                 |
| ----------- | ----------------------- | ----------------------- |
| Capability  | Executes code & actions | Static natural language |
| Security    | Controlled & auditable  | No external effects     |
| Flexibility | High (custom logic)     | Limited to inference    |

## Complete Our Greeting Server

Below is a simple example of a greeting server exposing a greeting resource:

```ts
import { ResourceServer } from "@modelcontextprotocol/sdk";

const server = new ResourceServer({ port: 3000 });

server.addResource({
  uri: "greeting://hello",
  displayName: "Greeting Resource",
  fn: async (req) => {
    const name = req.query.name || "World";
    return `Hello, ${name}!`;
  },
});

server.listen(() => console.log("Greeting server running on port 3000"));
```

## Sources & Additional Reading

- [MCP Prompts](https://modelcontextprotocol.io/docs/concepts/prompts)
- [unichat-mcp-server](https://github.com/amidabuddha/unichat-mcp-server)
- [Claude Prompt Engineering](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)
- [10 Prompt Engineering Best Practices](https://dev.to/get_pieces/10-prompt-engineering-best-practices-23dk)
- [Prompting Guide](https://promptingguide.ai)

## License

MIT
