"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CategoryScroller } from "./CategoryScroller";
import { SearchBar } from "./SearchBar";
import { API_ENDPOINTS } from "@/lib/api-config";

type Category = {
    id: number;
    name: string;
    description: string;
    slug: string;
    icon: string;
    color: string;
    certifications: Certification[];
};

type Certification = {
    id: number;
    name: string;
    description: string;
    slug: string;
    level: string;
    duration: number;
    questions_count: number;
    is_active: boolean;
    category_id: number;
    category_name?: string;
    category?: {
        id: number;
        name: string;
        description: string;
        slug: string;
        icon: string;
        color: string;
    };
};

type SearchResponse = {
    certifications: Certification[];
    total: number;
    page: number;
    per_page: number;
    has_next: boolean;
    has_prev: boolean;
};

interface CategoryBrowserProps {
    title?: string;
    subtitle?: string;
    showSearch?: boolean;
}

export function CategoryBrowser({
    title = "Browse by Category",
    subtitle = "Explore our comprehensive collection of certification exams",
    showSearch = true
}: CategoryBrowserProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.categories);
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            setCategories(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setSearchResults(null);
            return;
        }

        setSearchLoading(true);
        try {
            const response = await fetch(`${API_ENDPOINTS.searchCertifications}?q=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error('Search failed');
            }
            const data = await response.json();

            // Handle the actual API response structure with 'results' array
            const validatedData: SearchResponse = {
                certifications: data.results || [],
                total: data.results?.length || 0,
                page: data.page || 1,
                per_page: data.per_page || 10,
                has_next: data.has_next || false,
                has_prev: data.has_prev || false
            };

            setSearchResults(validatedData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Search failed');
        } finally {
            setSearchLoading(false);
        }
    };

    const handleClearSearch = () => {
        setSearchResults(null);
        setError(null);
        setSearchQuery("");
    };

    const handleCertificationClick = (slug: string) => {
        router.push(`/quiz/${slug}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                    <p className="mt-2 text-slate-600">Loading certification categories...</p>
                </div>
            </div>
        );
    }

    if (error && searchResults === null && !searchLoading && !categories.length) {
        return (
            <div className="text-center py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-red-600">Error: {error}</p>
                    <button
                        onClick={fetchCategories}
                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Search Bar */}
            {showSearch && (
                <div className="mb-8">
                    <SearchBar
                        onSearch={handleSearch}
                        onClear={handleClearSearch}
                        value={searchQuery}
                    />
                </div>
            )}

            {/* Search Results or Category Browser */}
            {searchResults ? (
                <div>
                    {/* Search Results Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900">Search Results</h3>
                            <p className="text-slate-600">Found {searchResults.certifications?.length || 0} certifications</p>
                        </div>
                        <button
                            onClick={handleClearSearch}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Clear Search
                        </button>
                    </div>

                    {/* Search Results */}
                    {searchLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                                <p className="mt-2 text-slate-600">Searching...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {searchResults.certifications && searchResults.certifications.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {searchResults.certifications.map((cert) => (
                                        <div
                                            key={cert.id}
                                            className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                            onClick={() => handleCertificationClick(cert.slug)}
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <h3 className="text-lg font-semibold text-slate-900 leading-tight line-clamp-2 flex-1">
                                                    {cert.name}
                                                </h3>
                                                <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full ml-3 flex-shrink-0">
                                                    {cert.level}
                                                </span>
                                            </div>

                                            {cert.description && (
                                                <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                                                    {cert.description}
                                                </p>
                                            )}

                                            <div className="flex items-center justify-between text-sm text-slate-500">
                                                <span>{cert.questions_count} Questions</span>
                                                <span>{cert.duration} Min</span>
                                            </div>

                                            {cert.category && (
                                                <div className="mt-3 text-xs text-slate-500">
                                                    Category: {cert.category.name}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-slate-400 mb-4">
                                        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-slate-900 mb-1">No certifications found</h3>
                                    <p className="text-slate-500">Try adjusting your search terms.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            ) : (
                <div>
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
                            {title}
                        </h3>
                        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto mb-4 rounded-full"></div>
                        <p className="text-lg text-slate-600">
                            {subtitle}
                        </p>
                    </div>

                    {/* Category Scroller */}
                    <CategoryScroller categories={categories} />

                    {/* Error Display */}
                    {error && (
                        <div className="mt-8 max-w-2xl mx-auto">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-600 text-center">Error: {error}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}