import { db } from "./drizzle";
import { posts, users } from "./drizzle.schema";

const user = await db
  .insert(users)
  .values({
    name: "test",
  })
  .returning()
  .then((x) => x[0]);

if (user == null) {
  throw new Error("User not found");
}

const post = await db.insert(posts).values({
  title: "test",
  content: "test",
  ownerId: user.id,
});
