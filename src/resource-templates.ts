// src/resource-templates.ts

export const resourceTemplates = [
  {
    uriTemplate: "greetings://{name}",
    name: "Personal Greeting",
    description: "A personalized greeting message",
    mimeType: "text/plain",
  },
];

const greetignExp = /^greetings:\/\/(.+)$/;
const greetingMatchHandler =
  (uri: string, matchText: RegExpMatchArray) => () => {
    const name = decodeURIComponent(matchText[1]);
    return {
      contents: [
        {
          uri,
          text: `Hello, ${name}! Welcome to MCP.`,
        },
      ],
    };
  };

export const getResoureTemplateHandler = (uri: string) => {
  const greetingMatch = uri.match(greetignExp);
  if (greetingMatch) return greetingMatchHandler(uri, greetingMatch);
};
