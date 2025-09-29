import { useRouter } from "next/navigation";
import { CategoryGroup } from "@/types/category-browser";

interface CategoryGridProps {
    categoryGroups: CategoryGroup[];
    error?: string | null;
}

export function CategoryGrid({ categoryGroups, error }: CategoryGridProps) {
    const router = useRouter();

    return (
        <div>
            {/* Category Groups Display */}
            <div className="space-y-8">
                {categoryGroups.map((group) => (
                    <div key={group.parent.id} className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <h2 className="text-xl font-bold text-slate-900">{group.parent.name}</h2>
                            <span className="text-sm text-slate-600">({group.children.length} categories)</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {group.children.map((category) => (
                                <div
                                    key={category.id}
                                    className="rounded-lg border p-4 bg-white hover:shadow-lg cursor-pointer transition-all hover:scale-105"
                                    onClick={() => router.push(`/category/${category.slug}`)}
                                >
                                    <h3 className="text-sm font-semibold mb-2">{category.name}</h3>
                                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">{category.description}</p>
                                    <div className="text-xs text-blue-600 font-medium">View Certifications →</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Error Display */}
            {error && (
                <div className="mt-8 max-w-2xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-600 text-center">Error: {error}</p>
                    </div>
                </div>
            )}
        </div>
    );
}