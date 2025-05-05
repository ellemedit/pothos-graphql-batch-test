import "dotenv/config";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { defineRelations } from "drizzle-orm";
import { Database } from "bun:sqlite";

import * as schema from "./drizzle.schema";

export const relations = defineRelations(schema, (r) => ({
  posts: {
    author: r.one.users({
      from: r.posts.ownerId,
      to: r.users.id,
    }),
  },
}));

const sqlite = new Database(process.env.DB_FILE_NAME!);

export const db = drizzle({
  client: sqlite,
  relations,
  schema,
  logger: true,
});
