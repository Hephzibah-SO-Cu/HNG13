// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todos: defineTable({
    title: v.string(),
    completed: v.boolean(),
    position: v.number(),
    createdAt: v.number()
  }).index("by_position", ["position"]),
});
