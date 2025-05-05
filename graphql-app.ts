import { createYoga } from "graphql-yoga";

import SchemaBuilder from "@pothos/core";
import DrizzlePlugin from "@pothos/plugin-drizzle";
import RelayPlugin from "@pothos/plugin-relay";
import WithInputPlugin from "@pothos/plugin-with-input";
import DataloaderPlugin from "@pothos/plugin-dataloader";

import { getTableConfig } from "drizzle-orm/sqlite-core";

import { db, relations } from "./drizzle";
import { printSchema } from "graphql";

type DrizzleRelations = typeof relations;

interface PothosTypes {
  DrizzleRelations: DrizzleRelations;
}

const builder = new SchemaBuilder<PothosTypes>({
  plugins: [RelayPlugin, WithInputPlugin, DataloaderPlugin, DrizzlePlugin],
  drizzle: {
    client: db,
    getTableConfig,
    relations,
  },
});

const UserRef = builder.drizzleNode("users", {
  name: "User",
  id: {
    column: (user) => user.id,
    // other options for the ID field can be passed here
  },
  fields: (t) => ({
    name: t.exposeString("name"),
  }),
});

const PostRef = builder.drizzleNode("posts", {
  name: "Post",
  id: {
    column: (user) => user.id,
    // other options for the ID field can be passed here
  },
  fields: (t) => ({
    title: t.exposeString("title"),
    content: t.exposeString("content"),
    publishedAt: t.exposeString("publishedAt"),
    author: t.relation("author"),
  }),
});

builder.queryType({
  fields: (t) => ({
    post: t.drizzleField({
      type: "posts",
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: (query, root, args, ctx) =>
        db.query.posts.findFirst(
          query({
            where: {
              id: Number.parseInt(args.id, 10),
            },
          })
        ),
    }),
    posts: t.drizzleField({
      type: ["posts"],
      resolve: (query, root, args, ctx) => db.query.posts.findMany(query()),
    }),
  }),
});

// builder.mutationType({
//   fields: (t) => ({
//     createPost: t.drizzleField({
//       type: "posts",
//       args: {
//         title: t.arg.string({ required: true }),
//         content: t.arg.string({ required: true }),
//         authorId: t.arg.id({ required: true }),
//       },
//       resolve: (query, root, args, ctx) =>
//         db
//           .insert(posts)
//           .values({
//             title: args.title,
//             content: args.content,
//             ownerId: args.authorId,
//           })
//           .returning()
//           .then((x) => x[0]),
//     }),
//   }),
// });

const schema = builder.toSchema();

Bun.write("./schema.graphql", printSchema(schema));

const yoga = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
  batching: {
    limit: 1000,
  },
});

const server = Bun.serve({
  fetch: yoga,
  port: 8000,
});

console.info(
  `Server is running on ${new URL(
    yoga.graphqlEndpoint,
    `http://${server.hostname}:${server.port}`
  )}`
);
