// convex/todos.ts
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all todos, sorted by their 'order'
export const get = query({
  handler: async (ctx) => {
    return await ctx.db.query("todos").order("asc").collect();
  },
});

// Add a new todo
export const add = mutation({
  args: {
    text: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the last todo to determine the new order
    const lastTodo = await ctx.db.query("todos").order("desc").first();
    const newOrder = lastTodo ? lastTodo.order + 1 : 1;

    await ctx.db.insert("todos", {
      text: args.text,
      isCompleted: false,
      order: newOrder,
    });
  },
});

// Toggle a todo's completed status
export const toggle = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.id);
    if (todo) {
      await ctx.db.patch(args.id, { isCompleted: !todo.isCompleted });
    }
  },
});

// Delete a todo
export const remove = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Clear all completed todos
export const clearCompleted = mutation({
  handler: async (ctx) => {
    const completed = await ctx.db
      .query("todos")
      .filter((q) => q.eq(q.field("isCompleted"), true))
      .collect();

    await Promise.all(completed.map((todo) => ctx.db.delete(todo._id)));
  },
});

// Update the order of all todos after drag-and-drop
export const updateOrder = mutation({
  args: {
    todos: v.array(v.object({ _id: v.id("todos"), order: v.number() })),
  },
  handler: async (ctx, args) => {
    // Use Promise.all to update all orders concurrently
    await Promise.all(
      args.todos.map((todo) =>
        ctx.db.patch(todo._id, { order: todo.order })
      )
    );
  },
});