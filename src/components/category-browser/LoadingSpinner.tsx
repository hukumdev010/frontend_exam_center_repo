interface LoadingSpinnerProps {
    message?: string;
}

export function LoadingSpinner({ message = "Loading..." }: LoadingSpinnerProps) {
    return (
        <div className="flex items-center justify-center py-12">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                <p className="mt-2 text-slate-600">{message}</p>
            </div>
        </div>
    );
}