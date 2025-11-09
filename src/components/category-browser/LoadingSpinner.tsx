interface LoadingSpinnerProps {
    message?: string;
}

export function LoadingSpinner({ message = "Loading..." }: LoadingSpinnerProps) {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
            {/* Keep the exact same header structure as CategoryGrid */}
            <div className="mb-6 text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Browse Categories</h2>
                <p className="text-gray-600">Explore certification programs by category</p>
            </div>

            {/* Loading content with spinner overlay */}
            <div className="space-y-6 relative">
                {/* Skeleton Category Groups */}
                {[...Array(3)].map((_, groupIndex) => (
                    <div key={groupIndex} className="space-y-3 opacity-30">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                                <div className="h-5 bg-gray-200 rounded w-32"></div>
                            </div>
                            <div className="h-6 bg-gray-200 rounded w-20"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {[...Array(groupIndex === 0 ? 10 : 5)].map((_, i) => (
                                <div key={i} className="rounded-xl border border-gray-200/50 p-4 bg-gradient-to-br from-white to-gray-50/50">
                                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                    <div className="space-y-1 mb-3">
                                        <div className="h-2 bg-gray-200 rounded w-full"></div>
                                        <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                                    </div>
                                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Centered loading spinner overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-xl">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mb-3"></div>
                        <p className="text-slate-600 text-sm font-medium">{message}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}