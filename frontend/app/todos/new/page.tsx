import { createTodo } from "../../actions";
import { redirect } from "next/navigation";

export default function NewTodoPage() {
  async function handleCreate(formData: FormData) {
    "use server";
    await createTodo(formData);
    redirect("/todos");
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">새 할 일 추가</h1>
      <form action={handleCreate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">제목 *</label>
          <input
            name="title"
            required
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="할 일을 입력하세요"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">설명</label>
          <textarea
            name="description"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="상세 내용 (선택)"
            rows={3}
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            추가
          </button>
          <a href="/todos" className="px-6 py-2 border rounded-lg hover:bg-gray-50">
            취소
          </a>
        </div>
      </form>
    </main>
  );
}