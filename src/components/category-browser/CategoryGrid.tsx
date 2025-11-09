import { useRouter } from "next/navigation";
import { CategoryGroup } from "@/types/category-browser";
import { CategoryGridLoading } from "./CategoryGridLoading";

interface CategoryGridProps {
    categoryGroups: CategoryGroup[];
    error?: string | null;
    compact?: boolean;
    isLoading?: boolean;
}

export function CategoryGrid({ categoryGroups, error, isLoading = false /* compact = false */ }: CategoryGridProps) {
    const router = useRouter();

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
            <div className="mb-6 text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Browse Categories</h2>
                <p className="text-gray-600">Explore certification programs by category</p>
            </div>

            {/* Loading State - positioned close to header */}
            {isLoading ? (
                <CategoryGridLoading />
            ) : (
                /* Category Groups Display */
                <div className="space-y-6">
                    {categoryGroups.map((group, groupIndex) => (
                        <div key={group.parent.id} className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                                    {group.parent.name}
                                </h3>
                                <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                                    {group.children.length} categories
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {group.children.slice(0, groupIndex === 0 ? 10 : 5).map((category) => (
                                    <div
                                        key={category.id}
                                        className="group rounded-xl border border-gray-200/50 p-4 bg-gradient-to-br from-white to-gray-50/50 hover:shadow-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:border-blue-300/50"
                                        onClick={() => router.push(`/category/${category.slug}`)}
                                    >
                                        <h4 className="text-sm font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                            {category.name}
                                        </h4>
                                        <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">
                                            {category.description || 'Explore certifications in this category'}
                                        </p>
                                        <div className="text-xs text-blue-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                            View Certifications
                                            <span className="text-blue-400 group-hover:translate-x-0.5 transition-transform">→</span>
                                        </div>
                                    </div>
                                ))}

                                {/* Show More Button for truncated categories */}
                                {group.children.length > (groupIndex === 0 ? 10 : 5) && (
                                    <div
                                        className="group rounded-xl border-2 border-dashed border-gray-300 p-4 bg-gray-50/50 hover:bg-blue-50/50 hover:border-blue-300 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center text-center"
                                        onClick={() => {/* Handle show more */ }}
                                    >
                                        <div className="text-gray-400 group-hover:text-blue-500 transition-colors text-2xl mb-1">+</div>
                                        <div className="text-xs text-gray-500 group-hover:text-blue-600 font-medium">
                                            +{group.children.length - (groupIndex === 0 ? 10 : 5)} more
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="mt-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-600 text-center text-sm">Error: {error}</p>
                    </div>
                </div>
            )}
        </div>
    );
}