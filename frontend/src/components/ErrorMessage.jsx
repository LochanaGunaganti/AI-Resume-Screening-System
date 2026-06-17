export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-gray-800 font-semibold">Something went wrong</p>
        {message && <p className="text-gray-500 text-sm mt-1">{message}</p>}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
