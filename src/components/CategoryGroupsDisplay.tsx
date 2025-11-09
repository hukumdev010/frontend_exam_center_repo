"use client";

import { useRouter } from "next/navigation";

interface Category {
    id: number;
    name: string;
    description: string;
    slug: string;
    icon: string;
    color: string;
}

interface CategoryGroup {
    parent: Category;
    children: Category[];
}

interface CategoryGroupsDisplayProps {
    groups: CategoryGroup[];
}

export function CategoryGroupsDisplay({ groups }: CategoryGroupsDisplayProps) {
    const router = useRouter();

    const handleCategoryClick = (categorySlug: string) => {
        router.push(`/category/${categorySlug}`);
    };

    if (!groups || groups.length === 0) {
        return (
            <div className="text-center py-12 text-slate-500">
                <div className="text-6xl mb-4">📂</div>
                <h3 className="text-xl font-semibold mb-2">No category groups available</h3>
                <p>Check back later for new certification categories.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {groups.map((group) => (
                <div key={group.parent.id} className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <div className="rounded-xl p-2 bg-slate-100">
                            <span className="text-2xl">📚</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">{group.parent.name}</h2>
                            <p className="text-sm text-slate-600">{group.parent.description}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {group.children.map((category) => (
                            <div
                                key={category.id}
                                className="rounded-lg border p-4 bg-white hover:shadow-md cursor-pointer transition-all hover:scale-105"
                                onClick={() => handleCategoryClick(category.slug)}
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
    );
}
