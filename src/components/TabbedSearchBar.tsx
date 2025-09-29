"use client";

import { useState, useEffect } from "react";
import { Search, X, Users, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";

interface TabbedSearchBarProps {
    onCertificationSearch: (query: string) => void;
    onTeacherSearch: (query: string) => void;
    onClear: () => void;
    value?: string;
    activeTab?: "certifications" | "teachers";
}

export function TabbedSearchBar({
    onCertificationSearch,
    onTeacherSearch,
    onClear,
    value = "",
    activeTab: initialActiveTab = "certifications"
}: TabbedSearchBarProps) {
    const [searchQuery, setSearchQuery] = useState(value);
    const [activeTab, setActiveTab] = useState<"certifications" | "teachers">(initialActiveTab);

    // Debounced search with 500ms delay
    const debouncedSearch = useDebounce((query: string) => {
        if (query.trim()) {
            if (activeTab === "certifications") {
                onCertificationSearch(query.trim());
            } else {
                onTeacherSearch(query.trim());
            }
        } else {
            onClear();
        }
    }, 500);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            if (activeTab === "certifications") {
                onCertificationSearch(searchQuery.trim());
            } else {
                onTeacherSearch(searchQuery.trim());
            }
        }
    };

    const handleClear = () => {
        setSearchQuery("");
        onClear();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Trigger debounced search
        debouncedSearch(query);
    };

    const handleTabChange = (tab: "certifications" | "teachers") => {
        setActiveTab(tab);
        // Clear search when switching tabs
        setSearchQuery("");
        onClear();
    };

    // Update internal state when value prop changes
    useEffect(() => {
        setSearchQuery(value);
    }, [value]);

    const getPlaceholder = () => {
        return activeTab === "certifications"
            ? "Search certifications..."
            : "Search teachers by name or expertise...";
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            {/* Tab Headers */}
            <div className="flex items-center justify-center mb-6">
                <div className="inline-flex rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-1.5 shadow-lg border border-blue-100">
                    <button
                        type="button"
                        onClick={() => handleTabChange("certifications")}
                        className={`inline-flex items-center space-x-3 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === "certifications"
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105 transform"
                            : "text-slate-600 hover:text-blue-600 hover:bg-white/50 hover:scale-102 transform"
                            }`}
                    >
                        <BookOpen className={`w-5 h-5 ${activeTab === "certifications" ? "text-white" : "text-blue-500"}`} />
                        <span>Browse Certifications</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTabChange("teachers")}
                        className={`inline-flex items-center space-x-3 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === "teachers"
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105 transform"
                            : "text-slate-600 hover:text-blue-600 hover:bg-white/50 hover:scale-102 transform"
                            }`}
                    >
                        <Users className={`w-5 h-5 ${activeTab === "teachers" ? "text-white" : "text-blue-500"}`} />
                        <span>Find Teachers</span>
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative w-full">
                <div className="relative group">
                    <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-blue-400 group-focus-within:text-blue-600 transition-colors duration-300">
                        <Search className="w-6 h-6" />
                    </div>
                    <Input
                        type="text"
                        placeholder={getPlaceholder()}
                        value={searchQuery}
                        onChange={handleInputChange}
                        className="pl-14 pr-14 py-6 w-full text-lg border-2 border-blue-200/50 rounded-3xl 
                                 focus:border-blue-400 focus:ring-6 focus:ring-blue-100/50 
                                 bg-white/90 backdrop-blur-md shadow-xl hover:shadow-2xl 
                                 transition-all duration-500 placeholder:text-slate-400
                                 group-hover:border-blue-300 group-focus-within:bg-white
                                 outline-none"
                    />
                    {searchQuery && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleClear}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2.5 h-11 w-11 
                                     rounded-full hover:bg-red-50 hover:text-red-500 transition-all duration-300
                                     group bg-slate-50 border border-slate-200 hover:border-red-200"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    )}
                </div>
            </form>


        </div>
    );
}