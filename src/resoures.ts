export const resources = {
  uri: "hello://world",
  name: "Hello World Message",
  description: "A simple greeting message",
  mimeType: "text/plain",
};

export const resourceHandlers = {
  "hello://world": () => ({
    contents: [
      {
        uri: "hello://world",
        text: "Hello, world! This is my first MCP resource",
      },
    ],
  }),
};

export const getResourceHandler = (uri: string) => {
  return resourceHandlers[uri as keyof typeof resourceHandlers];
};
