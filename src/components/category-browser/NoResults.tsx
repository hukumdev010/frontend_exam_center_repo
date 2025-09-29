import { BookOpen, Users } from "lucide-react";
import { SearchTab } from "@/types/category-browser";

interface NoResultsProps {
    activeTab: SearchTab;
    searchQuery: string;
}

export function NoResults({ activeTab, searchQuery }: NoResultsProps) {
    return (
        <div className="p-12 text-center">
            <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full 
                              flex items-center justify-center mx-auto mb-6">
                    {activeTab === "certifications" ? (
                        <BookOpen className="w-10 h-10 text-slate-400" />
                    ) : (
                        <Users className="w-10 h-10 text-slate-400" />
                    )}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                    No {activeTab === "certifications" ? "certifications" : "teachers"} found
                </h3>
                <p className="text-slate-600 mb-4">
                    We couldn&apos;t find any {activeTab === "certifications" ? "certifications" : "teachers"} matching &quot;{searchQuery}&quot;
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-700">
                        💡 Try adjusting your search terms or browse categories below
                    </p>
                </div>
            </div>
        </div>
    );
}