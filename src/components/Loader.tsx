export default function Loader() {
  return (
    <div className="max-w-6xl mx-auto p-6 animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-72 sm:h-96 bg-gray-300 rounded-2xl mb-8"></div>

      {/* Title + small info */}
      <div className="space-y-3 mb-8">
        <div className="h-6 bg-gray-300 rounded w-2/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>

      {/* Description paragraph skeleton */}
      <div className="space-y-2 mb-8">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>

      {/* Grid of cards skeleton (for home page reuse) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl shadow border border-gray-100"
          >
            <div className="w-full h-40 bg-gray-300 rounded mb-4"></div>
            <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
