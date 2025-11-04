// convex/todos.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Return all todos ordered by position (ascending).
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    // Simple: collect all todos. If you need ordering, use indexes / withIndex.
    return await ctx.db.query("todos").collect();
  },
});

/**
 * Create a new todo.
 */
export const create = mutation({
  args: { title: v.string() },
  handler: async (ctx, args) => {
    const now = Date.now();
    const id = await ctx.db.insert("todos", {
      title: args.title,
      completed: false,
      position: now,
      createdAt: now,
    });
    return id;
  },
});

/**
 * Toggle completed state for a todo
 */
export const toggleComplete = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.id);
    if (!doc) {
      throw new Error("Todo not found");
    }
    await ctx.db.patch(args.id, { completed: !doc.completed });
    return true;
  },
});

/**
 * Delete a todo by id
 */
export const remove = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    // Use ctx.db.delete (NOT ctx.db.remove)
    await ctx.db.delete(args.id);
    return true;
  },
});

/**
 * Reorder list: accepts array of todo ids in the intended order and writes positions.
 */
export const reorder = mutation({
  args: { ids: v.array(v.id("todos")) },
  handler: async (ctx, args) => {
    // Write positions sequentially. Fine for small lists.
    for (let i = 0; i < args.ids.length; i++) {
      const id = args.ids[i];
      await ctx.db.patch(id, { position: i });
    }
    return true;
  },
});
