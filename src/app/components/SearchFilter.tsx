import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import TabToggle from "./TabToggle";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchFilterProps {
    activeTab: 'certifications' | 'teachers';
    onTabChange: (tab: 'certifications' | 'teachers') => void;
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
}

export default function SearchFilter({ activeTab, onTabChange, searchQuery = "", onSearchChange }: SearchFilterProps) {
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

    // Debounced search with 500ms delay
    const debouncedSearch = useDebounce((query: string) => {
        onSearchChange?.(query);
    }, 500);

    // Update local state when searchQuery prop changes
    useEffect(() => {
        setLocalSearchQuery(searchQuery);
    }, [searchQuery]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setLocalSearchQuery(query);

        // Trigger debounced search
        debouncedSearch(query);
    };

    return (
        <div className="bg-white/80 rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={localSearchQuery}
                        onChange={handleInputChange}
                        placeholder={activeTab === 'certifications' ? "Search certifications..." : "Search teachers..."}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    />
                </div>

                <TabToggle activeTab={activeTab} onTabChange={onTabChange} />
            </div>
        </div>
    );
}