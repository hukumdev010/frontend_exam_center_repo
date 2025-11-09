"use client";

import { useState, useEffect } from "react";
import { TabbedSearchBar } from "../TabbedSearchBar";
import { SearchResultsList } from "./SearchResultsList";
import { SearchResponse, TeacherSearchResponse, SearchTab, Teacher } from "@/types/category-browser";
import { API_ENDPOINTS } from "@/lib/api-config";

interface BrowseSearchSectionProps {
    compact?: boolean;
    onSearchStateChange?: (hasResults: boolean) => void;
}

export function BrowseSearchSection({ compact = false, onSearchStateChange }: BrowseSearchSectionProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeSearchTab, setActiveSearchTab] = useState<SearchTab>("certifications");
    const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
    const [teacherResults, setTeacherResults] = useState<TeacherSearchResponse | null>(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCertificationSearch = async (query: string) => {
        setSearchQuery(query);
        setActiveSearchTab("certifications");

        if (!query.trim()) {
            setSearchResults(null);
            setTeacherResults(null);
            return;
        }

        setSearchLoading(true);
        setError(null);
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
            setTeacherResults(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Search failed');
        } finally {
            setSearchLoading(false);
        }
    };

    const handleTeacherSearch = async (query: string) => {
        setSearchQuery(query);
        setActiveSearchTab("teachers");

        if (!query.trim()) {
            setSearchResults(null);
            setTeacherResults(null);
            return;
        }

        setSearchLoading(true);
        setError(null);
        try {
            // Use the list teachers endpoint with search-like filtering
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
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Teacher search failed');
        } finally {
            setSearchLoading(false);
        }
    };

    const handleClearSearch = () => {
        setSearchResults(null);
        setTeacherResults(null);
        setSearchQuery("");
        setError(null);
        onSearchStateChange?.(false);
    };

    const hasSearchResults = searchResults || teacherResults;

    // Notify parent when search results change
    useEffect(() => {
        onSearchStateChange?.(!!hasSearchResults);
    }, [hasSearchResults, onSearchStateChange]);

    return (
        <div className="space-y-6">
            {/* Search Input */}
            <div className={`bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-purple-50/30 rounded-2xl ${compact ? 'p-4' : 'p-6'} shadow-lg border border-blue-100/50`}>
                {!compact && (
                    <div className="text-center mb-4">
                        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                            Discover & Learn
                        </h2>
                        <p className="text-slate-600">
                            Find expert teachers or explore certification programs
                        </p>
                    </div>
                )}
                <TabbedSearchBar
                    onCertificationSearch={handleCertificationSearch}
                    onTeacherSearch={handleTeacherSearch}
                    onClear={handleClearSearch}
                    value={searchQuery}
                    activeTab={activeSearchTab}
                    compact={compact}
                />
                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}
            </div>

            {/* Search Results */}
            {hasSearchResults && (
                <SearchResultsList
                    searchResults={searchResults}
                    teacherResults={teacherResults}
                    searchLoading={searchLoading}
                    activeTab={activeSearchTab}
                    searchQuery={searchQuery}
                    onClearSearch={handleClearSearch}
                />
            )}
        </div>
    );
}