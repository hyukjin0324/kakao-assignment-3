import { getTodos, updateTodo } from "../../../actions";
import { redirect, notFound } from "next/navigation";

export default async function EditTodoPage({ params }: { params: { todoId: string } }) {
  const todos = await getTodos();
  const todo = todos.find((t) => t.id === Number(params.todoId));
  if (!todo) notFound();

  async function handleUpdate(formData: FormData) {
    "use server";
    await updateTodo(Number(params.todoId), {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
    });
    redirect("/todos");
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">할 일 수정</h1>
      <form action={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">제목 *</label>
          <input
            name="title"
            defaultValue={todo.title}
            required
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">설명</label>
          <textarea
            name="description"
            defaultValue={todo.description}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            저장
          </button>
          <a href="/todos" className="px-6 py-2 border rounded-lg hover:bg-gray-50">
            취소
          </a>
        </div>
      </form>
    </main>
  );
}