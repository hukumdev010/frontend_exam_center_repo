export function CategoryGridLoading() {
    return (
        <div className="mt-5">
            {/* Centered Loading Spinner - positioned close to header */}
            <div className="flex items-center justify-center py-6">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mb-3"></div>
                    <p className="text-slate-600 text-sm font-medium">Loading certification categories...</p>
                </div>
            </div>

            {/* Optional: Minimal skeleton preview */}
            <div className="space-y-4 opacity-20">
                {[...Array(2)].map((_, groupIndex) => (
                    <div key={groupIndex} className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="rounded-lg border border-gray-200/30 p-3 bg-gradient-to-br from-white to-gray-50/30">
                                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                                    <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}