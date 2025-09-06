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
        <form onSubmit={handleSearch} className="relative">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                    type="text"
                    placeholder={placeholder}
                    value={searchQuery}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 py-2 w-full max-w-md"
                />
                {searchQuery && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleClear}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 h-8 w-8"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </form>
    );
}
