"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
    onSearch: (query: string) => void;
    onClear: () => void;
    placeholder?: string;
    value?: string;
}

export function SearchBar({ onSearch, onClear, placeholder = "Search certifications...", value = "" }: SearchBarProps) {
    const [searchQuery, setSearchQuery] = useState(value);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            onSearch(searchQuery.trim());
        }
    };

    const handleClear = () => {
        setSearchQuery("");
        onClear();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        // If user clears the search, trigger onClear
        if (query === "") {
            onClear();
        }
    };

    return (
        <form onSubmit={handleSearch} className="relative w-full">
            <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5">
                    <Search className="w-5 h-5" />
                </div>
                <Input
                    type="text"
                    placeholder={placeholder}
                    value={searchQuery}
                    onChange={handleInputChange}
                    className="pl-12 pr-12 py-4 w-full text-lg border-2 border-blue-200 rounded-2xl 
                             focus:border-blue-400 focus:ring-4 focus:ring-blue-100 
                             bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl 
                             transition-all duration-300 placeholder:text-slate-400"
                />
                {searchQuery && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleClear}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 h-10 w-10 
                                 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </form>
    );
}
