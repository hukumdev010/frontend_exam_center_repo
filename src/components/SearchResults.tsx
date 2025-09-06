"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchResult {
    id: number;
    name: string;
    description: string;
    slug: string;
    level: string;
    duration: number;
    questions_count: number;
    category: {
        id: number;
        name: string;
        description: string;
        slug: string;
        icon: string;
        color: string;
    } | null;
}

interface SearchResultsProps {
    results: SearchResult[];
    total: number;
    query: string;
    onCertificationSelect: (slug: string) => void;
}

export function SearchResults({ results, total, query, onCertificationSelect }: SearchResultsProps) {
    const getLevelColor = (level: string) => {
        switch (level.toLowerCase()) {
            case 'foundational':
            case 'fundamentals':
                return "bg-green-100 text-green-800";
            case 'associate':
            case 'intermediate':
                return "bg-blue-100 text-blue-800";
            case 'professional':
            case 'advanced':
                return "bg-purple-100 text-purple-800";
            case 'specialty':
                return "bg-orange-100 text-orange-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getCategoryIcon = (iconName: string) => {
        switch (iconName) {
            case 'aws':
                return "☁️";
            case 'code':
                return "💻";
            case 'server':
                return "🖥️";
            case 'terminal':
                return "⌨️";
            default:
                return "📚";
        }
    };

    if (results.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                    <p className="text-lg text-slate-600 mb-2">No certifications found for &quot;{query}&quot;</p>
                    <p className="text-sm text-slate-500">
                        Try adjusting your search terms or browse our categories below.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Search Results</h2>
                <p className="text-slate-600">
                    Found {total} certification{total !== 1 ? 's' : ''} for &quot;{query}&quot;
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((cert) => (
                    <div
                        key={cert.id}
                        className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                        {/* Category and Level */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                {cert.category && (
                                    <>
                                        <span className="text-lg mr-2">{getCategoryIcon(cert.category.icon)}</span>
                                        <span className="text-sm text-slate-600">{cert.category.name}</span>
                                    </>
                                )}
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(cert.level)}`}>
                                {cert.level}
                            </span>
                        </div>

                        {/* Certification Name */}
                        <h3 className="text-lg font-semibold text-slate-900 mb-3 leading-tight">
                            {cert.name}
                        </h3>

                        {/* Description */}
                        <p className="text-slate-600 mb-4 text-sm leading-relaxed line-clamp-3">
                            {cert.description}
                        </p>

                        {/* Details */}
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                            <span>{cert.questions_count} Questions</span>
                            <span>{cert.duration} Minutes</span>
                        </div>

                        {/* Action Button */}
                        <Button
                            onClick={() => onCertificationSelect(cert.slug)}
                            className="w-full inline-flex items-center justify-center gap-2 text-sm"
                        >
                            Start Practice Exam
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
