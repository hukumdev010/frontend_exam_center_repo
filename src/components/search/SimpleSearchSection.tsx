"use client";

import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchResultsList } from "./SearchResultsList";
import { SearchResponse, TeacherSearchResponse, SearchTab, Teacher } from "@/types/category-browser";
import { API_ENDPOINTS } from "@/lib/api-config";
import { useDebounce } from "@/hooks/useDebounce";

interface SimpleSearchSectionProps {
    onSearchStateChange?: (hasResults: boolean) => void;
}

export function SimpleSearchSection({ onSearchStateChange }: SimpleSearchSectionProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<SearchTab>("certifications");
    const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
    const [teacherResults, setTeacherResults] = useState<TeacherSearchResponse | null>(null);
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

    const searchCertifications = async (query: string) => {
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
        setTeacherResults(null);
    };

    const searchTeachers = async (query: string) => {
        const response = await fetch(`${API_ENDPOINTS.teachers.search}?is_available=true&limit=50`);
        if (!response.ok) {
            throw new Error('Teacher search failed');
        }
        const data: Teacher[] = await response.json();

        // Filter teachers client-side by name, email, or bio
        const filteredTeachers = data.filter((teacher) => {
            const searchLower = query.toLowerCase();
            return (
                teacher.user_name?.toLowerCase().includes(searchLower) ||
                teacher.user_email?.toLowerCase().includes(searchLower) ||
                teacher.bio?.toLowerCase().includes(searchLower)
            );
        });

        const teacherSearchData: TeacherSearchResponse = {
            teachers: filteredTeachers,
            total: filteredTeachers.length
        };

        setTeacherResults(teacherSearchData);
        setSearchResults(null);
    };

    const clearSearch = useCallback(() => {
        setSearchResults(null);
        setTeacherResults(null);
        setError(null);
        onSearchStateChange?.(false);
    }, [onSearchStateChange]);

    const performSearch = useCallback(async (query: string) => {
        setSearchLoading(true);
        setError(null);

        try {
            if (activeTab === "certifications") {
                await searchCertifications(query);
            } else {
                await searchTeachers(query);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Search failed');
        } finally {
            setSearchLoading(false);
        }
    }, [activeTab]);

    // Perform search when debounced term changes
    useEffect(() => {
        if (debouncedSearchTerm.trim()) {
            performSearch(debouncedSearchTerm);
        } else {
            clearSearch();
        }
    }, [debouncedSearchTerm, clearSearch, performSearch]);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
    };

    const handleClearSearch = () => {
        setSearchTerm("");
        clearSearch();
    };

    const handleTabChange = (tab: SearchTab) => {
        setActiveTab(tab);
        if (debouncedSearchTerm.trim()) {
            performSearch(debouncedSearchTerm);
        }
    };

    const hasSearchResults = searchResults || teacherResults;

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
                        Search Subjects & Teachers
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder="Search for certifications or teachers..."
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="pl-10"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>

                        {/* Tab buttons - only show when searching */}
                        {(searchTerm.trim() || hasSearchResults) && (
                            <div className="flex gap-2">
                                <Button
                                    variant={activeTab === "certifications" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleTabChange("certifications")}
                                >
                                    Certifications
                                </Button>
                                <Button
                                    variant={activeTab === "teachers" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleTabChange("teachers")}
                                >
                                    Teachers
                                </Button>
                            </div>
                        )}

                        <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>
                                {hasSearchResults && !searchLoading && (
                                    <>
                                        {activeTab === "certifications"
                                            ? `${searchResults?.total || 0} certifications`
                                            : `${teacherResults?.total || 0} teachers`} found
                                        {searchTerm && ` for "${searchTerm}"`}
                                    </>
                                )}
                                {searchLoading && "Searching..."}
                                {!searchTerm.trim() && !hasSearchResults && "Start typing to search"}
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

            {/* Search Results - using home page style */}
            {hasSearchResults && (
                <SearchResultsList
                    searchResults={searchResults}
                    teacherResults={teacherResults}
                    searchLoading={searchLoading}
                    activeTab={activeTab}
                    searchQuery={searchTerm}
                    onClearSearch={handleClearSearch}
                />
            )}
        </div>
    );
}