import { createYoga } from "graphql-yoga";

import SchemaBuilder from "@pothos/core";

interface NextContext {
  params: Promise<Record<string, string>>;
}

const builder = new SchemaBuilder({});

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string(),
      },
      resolve: (parent, { name }) => `hello, ${name || "World"}`,
    }),
  }),
});

const schema = builder.toSchema();

const { handleRequest } = createYoga<NextContext>({
  schema,
  graphqlEndpoint: "/api/graphql",
  batching: {
    limit: 1000,
  },
  fetchAPI: { Response },
});

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as OPTIONS,
};
