import { useState, useEffect } from "react";
import SearchFilter from "./SearchFilter";
import QuickFilters from "./QuickFilters";
import QuickActions from "./QuickActions";

interface SidebarProps {
    showSidebar: boolean;
    activeTab: 'certifications' | 'teachers';
    onTabChange: (tab: 'certifications' | 'teachers') => void;
    onCloseSidebar: () => void;
    onFiltersChange: (filters: FilterState) => void;
}

export interface FilterState {
    selectedCategories: string[];
    selectedTeachers: string[];
    searchQuery: string;
}

interface Category {
    id: number;
    name: string;
}

interface User {
    first_name?: string;
    last_name?: string;
}

interface Teacher {
    id: number;
    user?: User;
}

// interface TeacherProfile {
//     name?: string;
//     first_name?: string;
//     last_name?: string;
// }

export default function Sidebar({ showSidebar, activeTab, onTabChange, onCloseSidebar, onFiltersChange }: SidebarProps) {
    const [categoriesData, setCategoriesData] = useState<string[]>([]);
    const [teachersData, setTeachersData] = useState<string[]>([]);
    const [filters, setFilters] = useState<FilterState>({
        selectedCategories: [],
        selectedTeachers: [],
        searchQuery: ''
    });
    const [loading] = useState(true);
    const [mounted, setMounted] = useState(false);

    // Set mounted to true after component mounts (client-side only)
    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    // Fetch filter data from APIs
    useEffect(() => {
        const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

        // Fetch categories
        fetch(`${baseURL}/api/categories`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setCategoriesData(['All Categories', ...data.map((cat: Category) => cat.name)])
                }
            })
            .catch(console.error)

        // Fetch teachers
        fetch(`${baseURL}/api/teachers`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const teacherNames = data.map((teacher: Teacher) => {
                        const firstName = teacher.user?.first_name || ''
                        const lastName = teacher.user?.last_name || ''
                        return `${firstName} ${lastName}`.trim() || 'Unknown Teacher'
                    })
                    setTeachersData(['All Teachers', ...teacherNames])
                }
            })
            .catch(console.error)
    }, [])    // Notify parent when filters change
    useEffect(() => {
        if (mounted) {
            onFiltersChange(filters);
        }
    }, [filters, onFiltersChange, mounted]);

    const handleCategoryToggle = (category: string) => {
        setFilters(prev => ({
            ...prev,
            selectedCategories: category === 'All Categories'
                ? []
                : prev.selectedCategories.includes(category)
                    ? prev.selectedCategories.filter(c => c !== category)
                    : [...prev.selectedCategories, category]
        }));
    };

    const handleTeacherToggle = (teacher: string) => {
        setFilters(prev => ({
            ...prev,
            selectedTeachers: teacher === 'All Teachers'
                ? []
                : prev.selectedTeachers.includes(teacher)
                    ? prev.selectedTeachers.filter(t => t !== teacher)
                    : [...prev.selectedTeachers, teacher]
        }));
    };

    const handleSearchChange = (query: string) => {
        setFilters(prev => ({ ...prev, searchQuery: query }));
    };

    const clearAllFilters = () => {
        setFilters({
            selectedCategories: [],
            selectedTeachers: [],
            searchQuery: ""
        });
    };

    const handleQuickFilterSelect = (filterType: 'category' | 'subject', value: string) => {
        if (filterType === 'category') {
            handleCategoryToggle(value);
        } else if (filterType === 'subject') {
            // For subjects in teacher tab, we can search for teachers that teach that subject
            // For now, let's add it as a search query or teacher filter
            if (activeTab === 'teachers') {
                setFilters(prev => ({ ...prev, searchQuery: value }));
            } else {
                handleCategoryToggle(value);
            }
        }
    };
    // Don't render dynamic content until mounted (prevents hydration mismatch)
    if (!mounted) {
        return (
            <div className={`${showSidebar ? 'block' : 'hidden lg:block'} lg:w-80 xl:w-96 bg-gradient-to-b from-gray-50/90 to-white/90 backdrop-blur-sm border-r border-gray-200/50 p-6 space-y-6`}>
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">
                        Filters
                    </h2>
                    <button
                        onClick={onCloseSidebar}
                        className="lg:hidden text-gray-400 hover:text-gray-600 p-1"
                    >
                        ×
                    </button>
                </div>
                <div className="text-sm text-gray-500">Loading...</div>
            </div>
        );
    }

    const currentItems = activeTab === 'certifications' ? categoriesData : teachersData;
    const selectedItems = activeTab === 'certifications' ? filters.selectedCategories : filters.selectedTeachers;
    const handleItemToggle = activeTab === 'certifications' ? handleCategoryToggle : handleTeacherToggle;

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

            {/* Dynamic Filters */}
            <div className="space-y-4" key={activeTab}>
                {activeTab === 'certifications' ? (
                    <h3 className="text-sm font-medium text-gray-700">Categories</h3>
                ) : (
                    <h3 className="text-sm font-medium text-gray-700">Teachers</h3>
                )}

                {loading ? (
                    <div className="text-sm text-gray-500">Loading filters...</div>
                ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto" key={`${activeTab}-filters`}>
                        {currentItems.map((item, index) => (
                            <label key={`${activeTab}-${item}-${index}`} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item) || item.startsWith('All ')}
                                    onChange={() => handleItemToggle(item)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    data-hydration-key={`${activeTab}-${item}`}
                                />
                                <span className="text-sm text-gray-700 hover:text-gray-900">{item}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Legacy Quick Filters */}
            <QuickFilters
                activeTab={activeTab}
                onFilterSelect={handleQuickFilterSelect}
            />

            {/* Clear Filters Button */}
            <button
                onClick={clearAllFilters}
                className="w-full py-2 px-4 text-xs text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
                Clear All Filters
            </button>

            {/* Quick Action Button */}
            <QuickActions activeTab={activeTab} />

            {/* Reset Filters - same as clear for now */}
            <button
                onClick={clearAllFilters}
                className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
                Reset All Filters
            </button>
        </div>
    );
}