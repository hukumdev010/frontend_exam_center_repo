"use client";

import { useState, useEffect } from "react";

import { useCategories, useSearchCertifications } from "@/hooks/useApi";
import { CategoriesResponse, SearchResponse, TeacherSearchResponse, SearchTab } from "@/types/category-browser";

import { ErrorMessage } from "./category-browser/ErrorMessage";
import { SearchSection } from "./category-browser/SearchSection";
import { SearchResultsList } from "./search/SearchResultsList";
import { CategoryGrid } from "./category-browser/CategoryGrid";

interface CategoryBrowserProps {
    title?: string;
    subtitle?: string;
    showSearch?: boolean;
    compact?: boolean;
    onTabChange?: (tab: 'certifications' | 'teachers') => void;
    filters?: {
        selectedCategories: string[];
        searchQuery: string;
    };
}

export function CategoryBrowser({
    showSearch = true,
    compact = false,
    onTabChange,
    filters
}: CategoryBrowserProps) {
    // Use SWR for categories data
    const { data: categoriesData, error: categoriesError, isLoading } = useCategories()

    // Use search API when there's a search query
    const { data: searchData, error: searchError, isLoading: apiSearchLoading } = useSearchCertifications(filters?.searchQuery)

    const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
    const [teacherResults, setTeacherResults] = useState<TeacherSearchResponse | null>(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeSearchTab, setActiveSearchTab] = useState<SearchTab>("certifications");

    // Get category groups from SWR data
    let categoryGroups = (categoriesData as CategoriesResponse)?.groups || []
    const error = categoriesError?.message || null

    // Suppress unused variable warnings - these will be used when search is implemented
    void searchError;
    void apiSearchLoading;

    // Apply filters to categories
    if (filters) {
        // Filter by selected categories
        if (filters.selectedCategories.length > 0) {
            categoryGroups = categoryGroups.filter(group =>
                filters.selectedCategories.some(selectedCategory =>
                    group.parent.name.toLowerCase().includes(selectedCategory.toLowerCase()) ||
                    group.children.some(child => child.name.toLowerCase().includes(selectedCategory.toLowerCase()))
                )
            );
        }

        // When there's a search query, use API search results instead of local filtering
        if (filters.searchQuery && searchData) {
            // Convert API search results to the expected format and update searchResults state
            const certifications = searchData.results || searchData || [];
            const apiSearchResults: SearchResponse = {
                certifications: certifications,
                total: certifications.length,
                page: 1,
                per_page: certifications.length,
                has_next: false,
                has_prev: false
            };

            // Update the search results state to show API results
            if (searchResults?.total !== apiSearchResults.total) {
                setSearchResults(apiSearchResults);
            }
        }
    }

    // Notify parent about initial tab state
    useEffect(() => {
        if (onTabChange) {
            onTabChange(activeSearchTab);
        }
    }, [activeSearchTab, onTabChange]);

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
        // Notify parent component about tab change
        if (onTabChange) {
            onTabChange(activeTab);
        }
    };

    const handleClearSearch = () => {
        setSearchResults(null);
        setTeacherResults(null);
        setSearchQuery("");
    };

    // Show error only if not loading and no search results and no categories
    if (error && !isLoading && searchResults === null && teacherResults === null && !searchLoading && categoryGroups.length === 0) {
        return <ErrorMessage error={error} onRetry={() => window.location.reload()} />;
    }

    const hasSearchResults = searchResults || teacherResults;

    return (
        <div className={compact ? "space-y-4" : "space-y-6"}>
            {/* Search Section */}
            {showSearch && (
                <SearchSection
                    onSearchResults={handleSearchResults}
                    onSearchLoading={setSearchLoading}
                    onError={() => { }} // Handle search errors within SearchSection
                    compact={compact}
                />
            )}

            {/* Search Results or Category Browser */}
            {hasSearchResults ? (
                <SearchResultsList
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
                    isLoading={isLoading}
                    compact={compact}
                />
            )}
        </div>
    );
}