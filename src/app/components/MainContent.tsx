import { CategoryBrowser } from "@/components/CategoryBrowser";
import TeacherList from "@/components/TeacherList";
import type { FilterState } from "./Sidebar";

interface MainContentProps {
    activeTab: 'certifications' | 'teachers';
    onShowSidebar: () => void;
    filters: FilterState;
}

export default function MainContent({ activeTab, onShowSidebar, filters }: MainContentProps) {
    return (
        <div className="flex-1 p-6 lg:p-8">
            {/* Mobile sidebar toggle */}
            <div className="lg:hidden mb-6">
                <button
                    onClick={onShowSidebar}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    Show Filters & Search
                </button>
            </div>

            {/* Dynamic Main Content Area */}
            <div className="space-y-8 min-h-[600px]">
                {/* Show active filters if any are selected */}
                {(filters.selectedCategories.length > 0 || filters.selectedTeachers.length > 0 || filters.searchQuery) && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                                <span className="text-sm font-medium text-blue-700">Active Filters:</span>
                                {filters.searchQuery && (
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                        Search: &quot;{filters.searchQuery}&quot;
                                    </span>
                                )}
                                {filters.selectedCategories.map(category => (
                                    <span key={category} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                        {category}
                                    </span>
                                ))}
                                {filters.selectedTeachers.map(teacher => (
                                    <span key={teacher} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                        {teacher}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'certifications' ? (
                    <CategoryBrowser
                        showSearch={false}
                        filters={{
                            selectedCategories: filters.selectedCategories,
                            searchQuery: filters.searchQuery
                        }}
                    />
                ) : (
                    <TeacherList
                        filters={{
                            selectedTeachers: filters.selectedTeachers,
                            searchQuery: filters.searchQuery
                        }}
                    />
                )}
            </div>
        </div>
    );
}