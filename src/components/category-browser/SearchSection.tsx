import { useState } from "react";
import { TabbedSearchBar } from "../TabbedSearchBar";
import { SearchResponse, TeacherSearchResponse, SearchTab, Teacher } from "@/types/category-browser";
import { API_ENDPOINTS } from "@/lib/api-config";

interface SearchSectionProps {
    onSearchResults: (
        searchResults: SearchResponse | null,
        teacherResults: TeacherSearchResponse | null,
        activeTab: SearchTab,
        searchQuery: string
    ) => void;
    onSearchLoading: (loading: boolean) => void;
    onError: (error: string | null) => void;
}

export function SearchSection({ onSearchResults, onSearchLoading, onError }: SearchSectionProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeSearchTab, setActiveSearchTab] = useState<SearchTab>("certifications");

    const handleCertificationSearch = async (query: string) => {
        setSearchQuery(query);
        setActiveSearchTab("certifications");

        if (!query.trim()) {
            onSearchResults(null, null, "certifications", "");
            return;
        }

        onSearchLoading(true);
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

            onSearchResults(validatedData, null, "certifications", query);
        } catch (err) {
            onError(err instanceof Error ? err.message : 'Search failed');
        } finally {
            onSearchLoading(false);
        }
    };

    const handleTeacherSearch = async (query: string) => {
        setSearchQuery(query);
        setActiveSearchTab("teachers");

        if (!query.trim()) {
            onSearchResults(null, null, "teachers", "");
            return;
        }

        onSearchLoading(true);
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

            onSearchResults(null, teacherSearchData, "teachers", query);
        } catch (err) {
            onError(err instanceof Error ? err.message : 'Teacher search failed');
        } finally {
            onSearchLoading(false);
        }
    };

    const handleClearSearch = () => {
        onSearchResults(null, null, activeSearchTab, "");
        onError(null);
        setSearchQuery("");
    };

    return (
        <div className="bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-purple-50/30 rounded-3xl p-8 shadow-lg border border-blue-100/50">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    Discover & Learn
                </h2>
                <p className="text-slate-600 text-lg">
                    Find expert teachers or explore certification programs
                </p>
            </div>
            <TabbedSearchBar
                onCertificationSearch={handleCertificationSearch}
                onTeacherSearch={handleTeacherSearch}
                onClear={handleClearSearch}
                value={searchQuery}
                activeTab={activeSearchTab}
            />
        </div>
    );
}