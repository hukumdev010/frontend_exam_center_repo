interface ErrorMessageProps {
    error: string;
    onRetry?: () => void;
    retryLabel?: string;
}

export function ErrorMessage({ error, onRetry, retryLabel = "Try Again" }: ErrorMessageProps) {
    return (
        <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-red-600">Error: {error}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        {retryLabel}
                    </button>
                )}
            </div>
        </div>
    );
}