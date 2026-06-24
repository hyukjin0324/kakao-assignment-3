"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="max-w-2xl mx-auto p-6 text-center">
      <h2 className="text-2xl font-bold text-red-500 mb-4">오류가 발생했어요</h2>
      <p className="text-gray-500 mb-6">{error.message}</p>
      <button
        onClick={reset}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
      >
        다시 시도
      </button>
    </main>
  );
}