export default function Loading() {
  return (
    <main className="max-w-2xl mx-auto p-6">
      <div className="animate-pulse space-y-3">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    </main>
  );
}