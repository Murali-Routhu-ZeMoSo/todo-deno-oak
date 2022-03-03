import { Router } from "https://deno.land/x/oak/mod.ts";
import { Bson } from "https://deno.land/x/mongo@v0.29.0/mod.ts";

import { getDb } from "../helpers/db_client.ts";

const router = new Router();

interface Todo {
  id?: string;
  text: string;
}
interface User extends Bson.Document {
  _id: Bson.ObjectId;
  text: string;
}

let todos: Todo[] = [];

router.get("/todos", async (ctx) => {
  const todos = await getDb().collection("todos").find(); // { _id: ObjectId(), text: '...' }[]
  const transformedTodos = todos.map((todo: Bson.Document, Index: Number) => {
    return { id: todo._id.toString(), text: todo.text };
  });
  ctx.response.body = { todos: transformedTodos };
});

router.post("/todos", async (ctx) => {
  const data = await ctx.request.body().value;
  const newTodo: Todo = {
    // id: new Date().toISOString(),
    text: data.value.text,
  };

  const id = await getDb().collection("todos").insertOne(newTodo);

  newTodo.id = id.$oid;

  ctx.response.body = { message: "Created todo!", todo: newTodo };
});

router.put("/todos/:todoId", async (ctx) => {
  const tid = ctx.params.todoId;
  const data = await ctx.request.body().value;
  const todoIndex = todos.findIndex((todo) => {
    return todo.id === tid;
  });
  todos[todoIndex] = { id: todos[todoIndex].id, text: data.value.text };
  ctx.response.body = { message: "Updated todo" };
});

router.delete("/todos/:todoId", (ctx) => {
  const tid = ctx.params.todoId;
  todos = todos.filter((todo) => todo.id !== tid);
  ctx.response.body = { message: "Deleted todo" };
});

export default router;
