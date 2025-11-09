interface ErrorMessageProps {
    error: string;
    onRetry?: () => void;
    retryLabel?: string;
}

export function ErrorMessage({ error, onRetry, retryLabel = "Try Again" }: ErrorMessageProps) {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
            <div className="mb-6 text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
                <p className="text-gray-600">We encountered an error while loading the data</p>
            </div>

            <div className="text-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-red-600 text-sm">Error: {error}</p>
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                        >
                            {retryLabel}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}