import { getTodos } from "../actions";
import TodoClient from "./TodoClient";

export default async function TodosPage() {
  const todos = await getTodos();
  return <TodoClient initialTodos={todos} />;
}