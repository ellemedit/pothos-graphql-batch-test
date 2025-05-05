# Pothos GraphQL Batch Request Test

```sh
bun i
bun graphql-app.ts
```

```sh
curl -X POST http://localhost:8000/api/graphql \
  -H "Content-Type: application/json" \
  -d '[
    {
      "query": "query { node(id:\"UG9zdDoy\") { ... on Post { title } } }"
    },
    {
      "query": "query { node(id:\"UG9zdDoy\") { ... on Post { content } } }"
    },
    {
      "query": "query { node(id:\"UG9zdDox\") { ... on Post { content } } }"
    }
  ]'
```

result:

```json
[
  { "data": { "node": { "title": "test" } } },
  { "data": { "node": { "content": "test" } } },
  { "data": { "node": { "content": "test" } } }
]
```

db query:

```
Query: select "d0"."title" as "title", "d0"."id" as "id" from "posts" as "d0" where "d0"."id" in (?) -- params: [2]
Query: select "d0"."content" as "content", "d0"."id" as "id" from "posts" as "d0" where "d0"."id" in (?) -- params: [2]
Query: select "d0"."content" as "content", "d0"."id" as "id" from "posts" as "d0" where "d0"."id" in (?) -- params: [1]
```

It seems to be N+1 query problem occurs when you fetch GraphQL batch request.
