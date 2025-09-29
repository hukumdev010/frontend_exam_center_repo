import { BookOpen, Users } from "lucide-react";
import { SearchTab } from "@/types/category-browser";

interface SearchResultsHeaderProps {
    activeTab: SearchTab;
    searchQuery: string;
    resultsCount: number;
    onClear: () => void;
}

export function SearchResultsHeader({ activeTab, searchQuery, resultsCount, onClear }: SearchResultsHeaderProps) {
    return (
        <div className="bg-gradient-to-r from-slate-50 to-blue-50/30 px-6 py-4 border-b border-slate-200/50 flex items-center justify-between">
            <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                    {activeTab === "certifications" ? (
                        <>
                            <BookOpen className="w-5 h-5 text-blue-500" />
                            <span>Certification Results</span>
                        </>
                    ) : (
                        <>
                            <Users className="w-5 h-5 text-blue-500" />
                            <span>Teacher Results</span>
                        </>
                    )}
                </h3>
                <p className="text-slate-600 text-sm mt-1">
                    Found {resultsCount} {activeTab === "certifications" ? "certifications" : "teachers"} matching &quot;{searchQuery}&quot;
                </p>
            </div>
            <button
                onClick={onClear}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 
                         hover:bg-blue-50 rounded-lg transition-colors duration-200
                         border border-blue-200 hover:border-blue-300"
            >
                Clear Search
            </button>
        </div>
    );
}