"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchResponse } from "@/types/category-browser";
import { API_ENDPOINTS } from "@/lib/api-config";
import { useDebounce } from "@/hooks/useDebounce";

interface CertificationSearchSectionProps {
    onSearchStateChange?: (hasResults: boolean) => void;
}

interface CertificationSearchResultsProps {
    searchResults: SearchResponse | null;
    searchLoading: boolean;
    onClearSearch: () => void;
}

function CertificationSearchResults({
    searchResults,
    searchLoading,
    onClearSearch
}: CertificationSearchResultsProps) {
    if (searchLoading) {
        return (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 w-full max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="rounded-xl border border-gray-200/50 p-4 bg-gradient-to-br from-white to-gray-50/50 animate-pulse">
                            <div className="flex items-start mb-3">
                                <div className="flex items-center gap-2 flex-1">
                                    <div className="relative">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                        <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gray-300 rounded-full"></div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2 mb-3">
                                <div className="h-2 bg-gray-200 rounded w-full"></div>
                                <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                            </div>
                            <div className="h-3 bg-gray-200 rounded w-20"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!searchResults || !searchResults.certifications.length) {
        return (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 w-full max-w-7xl mx-auto">
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-6">
                        <Search className="h-16 w-16 mx-auto" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-3">
                        No Certifications Found
                    </h3>
                    <p className="text-gray-600 text-lg mb-6">
                        Try searching with different keywords or browse our categories.
                    </p>
                    <Button onClick={onClearSearch} variant="outline">
                        Clear Search
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 w-full max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.certifications.map((cert) => (
                    <div
                        key={cert.id}
                        className="group bg-gradient-to-br from-white to-blue-50/50 rounded-xl border border-blue-200/50 p-4 
                                 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer 
                                 hover:scale-105 transform hover:border-blue-300"
                        onClick={() => window.location.href = `/quiz/${cert.slug}/info`}
                    >
                        <div className="flex items-start mb-3">
                            <div className="flex items-center gap-3 flex-1">
                                <div className="relative">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl 
                                                  flex items-center justify-center text-white">
                                        <Search className="w-5 h-5" />
                                    </div>
                                    <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full 
                                                  flex items-center justify-center">
                                        <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 
                                                 transition-colors duration-300 line-clamp-1">
                                        {cert.name}
                                    </h3>
                                    {cert.category && (
                                        <p className="text-xs text-gray-500 line-clamp-1">
                                            {cert.category.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 mb-3">
                            {cert.description && (
                                <p className="text-xs text-gray-600 line-clamp-2">
                                    {cert.description}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                {cert.level}
                            </span>
                            <span className="text-xs text-gray-500">
                                {cert.questions_count} questions
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function CertificationSearchSection({ onSearchStateChange }: CertificationSearchSectionProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Debounced search with 300ms delay
    const debouncedSearch = useDebounce((query: string) => {
        setDebouncedSearchTerm(query);
    }, 300);

    // Update debounced search term when searchTerm changes
    useEffect(() => {
        debouncedSearch(searchTerm);
    }, [searchTerm, debouncedSearch]);

    // Perform search when debounced term changes
    useEffect(() => {
        if (debouncedSearchTerm.trim()) {
            performSearch(debouncedSearchTerm);
        } else {
            clearSearch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm]);

    const performSearch = async (query: string) => {
        setSearchLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_ENDPOINTS.searchCertifications}?q=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error('Certification search failed');
            }
            const data = await response.json();

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

    const clearSearch = () => {
        setSearchResults(null);
        setError(null);
        onSearchStateChange?.(false);
    };

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
    };

    const handleClearSearch = () => {
        setSearchTerm("");
        clearSearch();
    };

    const hasSearchResults = searchResults;

    // Notify parent when search results change
    useEffect(() => {
        onSearchStateChange?.(!!hasSearchResults || searchLoading);
    }, [hasSearchResults, searchLoading, onSearchStateChange]);

    return (
        <div className="space-y-6">
            {/* Simple Search Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        Search Certifications
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder="Search for certifications..."
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="pl-10"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>
                                {hasSearchResults && !searchLoading && (
                                    <>
                                        {searchResults?.total || 0} certifications found
                                        {searchTerm && ` for "${searchTerm}"`}
                                    </>
                                )}
                                {searchLoading && "Searching..."}
                                {!searchTerm.trim() && !hasSearchResults && "Start typing to search for certifications"}
                            </span>
                            {searchTerm && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleClearSearch}
                                >
                                    Clear Search
                                </Button>
                            )}
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {error}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Search Results */}
            {hasSearchResults && (
                <CertificationSearchResults
                    searchResults={searchResults}
                    searchLoading={searchLoading}
                    onClearSearch={handleClearSearch}
                />
            )}
        </div>
    );
}