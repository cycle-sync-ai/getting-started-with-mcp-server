import { type Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ReadResourceResultSchema,
  ReadResourceRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { getResourceHandler, resources } from "./resoures.js";
import {
  resourceTemplates,
  getResoureTemplateHandler,
} from "./resource-templates.js";
import { promptHandlers, prompts } from "./prompts.js";
import { toolHandlers, tools } from "./tools.js";

export const setupHandlers = (server: Server): void => {
  // List available resources when clients request them
  server.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources,
  }));

  // Resource Templates
  server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => ({
    resourceTemplates,
  }));

  // Return resource content when client request it
  server.setRequestHandler(ReadResourceRequestSchema, (request) => {
    const { uri } = request.params ?? {};

    const resourceHandler = getResourceHandler(uri);
    if (resourceHandler) return resourceHandler();

    const resourceTemplateHandler = getResoureTemplateHandler(uri);
    if (resourceTemplateHandler) return resourceTemplateHandler();

    throw new Error("Resource Not Found");
  });

  // Prompts
  server.setRequestHandler(ListPromptsRequestSchema, () => ({
    prompts: Object.values(prompts),
  }));
  server.setRequestHandler(GetPromptRequestSchema, (request) => {
    const { name, arguments: args } = request.params;
    const promptHandler = promptHandlers[name as keyof typeof promptHandlers];
    if (promptHandler)
      return promptHandler(args as { name: string; style?: string });
    throw new Error("Prompt not found");
  });

  // tools
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: Object.values(tools),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    type ToolHandlerKey = keyof typeof toolHandlers;
    const { name, arguments: params } = request.params ?? {};
    const handler = toolHandlers[name as ToolHandlerKey];
    if (!handler) throw new Error("Tool not found");

    type HandlerParams = Parameters<typeof handler>;
    return handler(...([params] as HandlerParams));
  });
};
