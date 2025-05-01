import { type Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { getResourceHandler, resources } from "./resoures.js";
import {
  resourceTemplates,
  getResoureTemplateHandler,
} from "./resource-templates.js";
import { promptHandlers, prompts } from "./prompts.js";

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
};
