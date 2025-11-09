import { useState, useEffect } from 'react';
import SearchFilter from "./SearchFilter";
import QuickFilters from "./QuickFilters";
import QuickActions from "./QuickActions";

interface FilterState {
    selectedCategories: string[];
    selectedTeachers: string[];
    searchQuery: string;
}

interface SidebarProps {
    showSidebar: boolean;
    activeTab: 'certifications' | 'teachers';
    onTabChange: (tab: 'certifications' | 'teachers') => void;
    onCloseSidebar: () => void;
    onFiltersChange?: (filters: FilterState) => void;
}

interface CategoryData {
    id: number;
    name: string;
}

interface TeacherData {
    id: number;
    user?: {
        first_name?: string;
        last_name?: string;
    };
}

export default function Sidebar({ showSidebar, activeTab, onTabChange, onCloseSidebar, onFiltersChange }: SidebarProps) {
    const [categories, setCategories] = useState<string[]>([]);
    const [teachers, setTeachers] = useState<string[]>([]);
    const [filters, setFilters] = useState<FilterState>({
        selectedCategories: [],
        selectedTeachers: [],
        searchQuery: ''
    });
    const [mounted, setMounted] = useState(false);

    // Handle mounting for hydration
    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    // Fetch filter data from APIs
    useEffect(() => {
        if (!mounted) return;

        const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

        // Fetch categories
        fetch(`${baseURL}/api/categories`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setCategories(['All Categories', ...data.map((cat: CategoryData) => cat.name)]);
                }
            })
            .catch(console.error);

        // Fetch teachers
        fetch(`${baseURL}/api/teachers`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const teacherNames = data.map((teacher: TeacherData) => {
                        const firstName = teacher.user?.first_name || '';
                        const lastName = teacher.user?.last_name || '';
                        return `${firstName} ${lastName}`.trim() || 'Unknown Teacher';
                    });
                    setTeachers(['All Teachers', ...teacherNames]);
                }
            })
            .catch(console.error);
    }, [mounted]);

    // Update parent when filters change
    useEffect(() => {
        onFiltersChange?.(filters);
    }, [filters, onFiltersChange]);

    const handleSearchChange = (searchQuery: string) => {
        setFilters(prev => ({ ...prev, searchQuery }));
    };

    const handleFilterToggle = (type: 'categories' | 'teachers', value: string) => {
        if (type === 'categories') {
            setFilters(prev => ({
                ...prev,
                selectedCategories: prev.selectedCategories.includes(value)
                    ? prev.selectedCategories.filter(c => c !== value)
                    : [...prev.selectedCategories, value]
            }));
        } else {
            setFilters(prev => ({
                ...prev,
                selectedTeachers: prev.selectedTeachers.includes(value)
                    ? prev.selectedTeachers.filter(t => t !== value)
                    : [...prev.selectedTeachers, value]
            }));
        }
    };

    const handleQuickFilterClick = (filter: string) => {
        if (activeTab === 'certifications') {
            handleFilterToggle('categories', filter);
        } else {
            handleFilterToggle('teachers', filter);
        }
    };

    const clearFilters = () => {
        setFilters({
            selectedCategories: [],
            selectedTeachers: [],
            searchQuery: ''
        });
    };

    // Don't render until mounted to prevent hydration mismatch
    if (!mounted) {
        return null;
    }

    const currentFilters = activeTab === 'certifications' ? categories : teachers;
    const selectedValues = activeTab === 'certifications' ? filters.selectedCategories : filters.selectedTeachers;

    return (
        <div className={`${showSidebar ? 'block' : 'hidden lg:block'} lg:w-80 xl:w-96 bg-gradient-to-b from-gray-50/90 to-white/90 backdrop-blur-sm border-r border-gray-200/50 p-6 space-y-6`}>
            {/* Sidebar Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                    {activeTab === 'certifications' ? 'Certification Filters' : 'Teacher Filters'}
                </h2>
                <button
                    onClick={onCloseSidebar}
                    className="lg:hidden text-gray-400 hover:text-gray-600 p-1"
                >
                    ×
                </button>
            </div>

            {/* Search and Tab Toggle */}
            <SearchFilter
                activeTab={activeTab}
                onTabChange={onTabChange}
                searchQuery={filters.searchQuery}
                onSearchChange={handleSearchChange}
            />

            {/* Quick Filters */}
            <QuickFilters
                activeTab={activeTab}
                onFilterClick={handleQuickFilterClick}
            />

            {/* Dynamic Filters */}
            <div className="space-y-4">
                <h3 key={`filter-title-${activeTab}`} className="text-sm font-medium text-gray-700">
                    {activeTab === 'certifications' ? 'Categories' : 'Teachers'}
                </h3>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                    {currentFilters.map((filter, index) => (
                        <label key={`${activeTab}-${filter}-${index}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedValues.includes(filter)}
                                onChange={() => handleFilterToggle(activeTab === 'certifications' ? 'categories' : 'teachers', filter)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{filter}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Clear Filters Button */}
            <button
                onClick={clearFilters}
                className="w-full py-2 px-4 text-xs text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
                Clear All Filters
            </button>

            {/* Quick Action Button */}
            <QuickActions activeTab={activeTab} />

            {/* Reset Filters */}
            <button
                onClick={clearFilters}
                className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
                Reset All Filters
            </button>
        </div>
    );
}

export type { FilterState };