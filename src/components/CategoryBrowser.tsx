"use client";

import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "@/lib/api-config";
import { CategoryGroup, CategoriesResponse, SearchResponse, TeacherSearchResponse, SearchTab } from "@/types/category-browser";
import { LoadingSpinner } from "./category-browser/LoadingSpinner";
import { ErrorMessage } from "./category-browser/ErrorMessage";
import { SearchSection } from "./category-browser/SearchSection";
import { SearchResults } from "./category-browser/SearchResults";
import { CategoryGrid } from "./category-browser/CategoryGrid";

interface CategoryBrowserProps {
    title?: string;
    subtitle?: string;
    showSearch?: boolean;
}

export function CategoryBrowser({
    showSearch = true
}: CategoryBrowserProps) {
    const [loading, setLoading] = useState(true);
    const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
    const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
    const [teacherResults, setTeacherResults] = useState<TeacherSearchResponse | null>(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeSearchTab, setActiveSearchTab] = useState<SearchTab>("certifications");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.categories);
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data: CategoriesResponse = await response.json();
            setCategoryGroups(data.groups);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchResults = (
        searchResults: SearchResponse | null,
        teacherResults: TeacherSearchResponse | null,
        activeTab: SearchTab,
        query: string
    ) => {
        setSearchResults(searchResults);
        setTeacherResults(teacherResults);
        setActiveSearchTab(activeTab);
        setSearchQuery(query);
    };

    const handleClearSearch = () => {
        setSearchResults(null);
        setTeacherResults(null);
        setError(null);
        setSearchQuery("");
    };

    if (loading) {
        return <LoadingSpinner message="Loading certification categories..." />;
    }

    if (error && searchResults === null && teacherResults === null && !searchLoading && categoryGroups.length === 0) {
        return <ErrorMessage error={error} onRetry={fetchCategories} />;
    }

    const hasSearchResults = searchResults || teacherResults;

    return (
        <div className="space-y-8">
            {/* Search Section */}
            {showSearch && (
                <SearchSection
                    onSearchResults={handleSearchResults}
                    onSearchLoading={setSearchLoading}
                    onError={setError}
                />
            )}

            {/* Search Results or Category Browser */}
            {hasSearchResults ? (
                <SearchResults
                    searchResults={searchResults}
                    teacherResults={teacherResults}
                    searchLoading={searchLoading}
                    activeTab={activeSearchTab}
                    searchQuery={searchQuery}
                    onClearSearch={handleClearSearch}
                />
            ) : (
                <CategoryGrid
                    categoryGroups={categoryGroups}
                    error={error}
                />
            )}
        </div>
    );
}