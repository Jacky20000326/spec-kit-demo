/**
 * Loading Spinner Component
 * Generic loading indicator
 */

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = '載入中...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-amber-500"></div>
      <p className="text-gray-600">{message}</p>
    </div>
  );
}
