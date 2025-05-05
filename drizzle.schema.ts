import * as s from "drizzle-orm/sqlite-core";

export const users = s.sqliteTable("users", {
  id: s.integer().primaryKey({ autoIncrement: true }),
  name: s.text().notNull(),
});

export const posts = s.sqliteTable("posts", {
  id: s.integer().primaryKey({ autoIncrement: true }),
  title: s.text().notNull(),
  content: s.text().notNull(),
  ownerId: s.integer("owner_id"),
  publishedAt: s.text("published_at"),
});
