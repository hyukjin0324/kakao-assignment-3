"use server";

import { revalidatePath } from "next/cache";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export type Todo = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  date: string;
};

export async function getTodos(): Promise<Todo[]> {
  const res = await fetch(`${BACKEND_URL}/todos`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch todos");
  return res.json();
}

export async function createTodo(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  if (!title) return;
  await fetch(`${BACKEND_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, date }),
  });
  revalidatePath("/todos");
}

export async function updateTodo(id: number, data: Partial<Todo>) {
  await fetch(`${BACKEND_URL}/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  revalidatePath("/todos");
}

export async function deleteTodo(id: number) {
  await fetch(`${BACKEND_URL}/todos/${id}`, { method: "DELETE" });
  revalidatePath("/todos");
}