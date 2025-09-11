"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Category {
    id: number;
    name: string;
    description: string;
    slug: string;
    icon: string;
    color: string;
    certifications: Certification[];
}

interface Certification {
    id: number;
    name: string;
    description: string;
    slug: string;
    level: string;
    duration: number;
    questions_count: number;
}

interface CategoryScrollerProps {
    categories: Category[];
}

export function CategoryScroller({ categories }: CategoryScrollerProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    const getIconComponent = (iconName: string) => {
        // For simplicity, we'll use emojis as icons since lucide icons would need individual imports
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

    const getCategoryColor = (color: string) => {
        switch (color) {
            case 'orange':
                return 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:from-orange-100 hover:to-orange-200 hover:border-orange-300';
            case 'blue':
                return 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-200 hover:border-blue-300';
            case 'purple':
                return 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-200 hover:border-purple-300';
            case 'green':
                return 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:from-green-100 hover:to-green-200 hover:border-green-300';
            default:
                return 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 hover:from-slate-100 hover:to-slate-200 hover:border-slate-300';
        }
    };

    const handleCertificationClick = (slug: string) => {
        router.push(`/quiz/${slug}`);
    };

    const handleMoreCertificationsClick = (categorySlug: string) => {
        router.push(`/category/${categorySlug}`);
    };

    if (categories.length === 0) {
        return (
            <div className="text-center py-8 text-slate-500">
                <p>No categories available.</p>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Navigation buttons */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full h-12 w-12 p-0 
                         bg-white/90 backdrop-blur-sm shadow-lg border-blue-200 hover:bg-blue-50 
                         hover:border-blue-300 transition-all duration-200"
            >
                <ChevronLeft className="w-5 h-5 text-blue-600" />
            </Button>

            <Button
                variant="outline"
                size="sm"
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full h-12 w-12 p-0 
                         bg-white/90 backdrop-blur-sm shadow-lg border-blue-200 hover:bg-blue-50 
                         hover:border-blue-300 transition-all duration-200"
            >
                <ChevronRight className="w-5 h-5 text-blue-600" />
            </Button>

            {/* Scrollable content */}
            <div
                ref={scrollRef}
                className="flex gap-8 overflow-x-auto scrollbar-hide px-16 py-6"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className={`flex-shrink-0 w-80 rounded-2xl border-2 p-6 transition-all duration-300 hover-lift
                                  ${getCategoryColor(category.color)} shadow-lg hover:shadow-xl`}
                    >
                        {/* Category Header */}
                        <div className="flex items-center mb-6">
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 mr-4 shadow-sm">
                                <span className="text-3xl">{getIconComponent(category.icon)}</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-1">{category.name}</h3>
                                <p className="text-sm text-slate-600 line-clamp-2">{category.description}</p>
                            </div>
                        </div>

                        {/* Certifications */}
                        <div className="space-y-3 max-h-72 overflow-y-auto">
                            {category.certifications.slice(0, 4).map((cert) => (
                                <div
                                    key={cert.id}
                                    className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 p-4 
                                             shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer 
                                             hover:bg-white/90 hover-scale"
                                    onClick={() => handleCertificationClick(cert.slug)}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <h4 className="text-sm font-semibold text-slate-900 leading-tight line-clamp-2 flex-1">
                                            {cert.name}
                                        </h4>
                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full ml-2 flex-shrink-0">
                                            {cert.level}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <span className="flex items-center">
                                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                                            {cert.questions_count} Questions
                                        </span>
                                        <span className="flex items-center">
                                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></span>
                                            {cert.duration} Min
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {category.certifications.length > 4 && (
                                <div className="text-center pt-2">
                                    <button
                                        onClick={() => handleMoreCertificationsClick(category.slug)}
                                        className="text-xs text-blue-600 bg-white/50 hover:bg-blue-50 hover:text-blue-700 
                                                 rounded-lg px-3 py-2 transition-all duration-200 cursor-pointer 
                                                 border border-blue-200 hover:border-blue-300"
                                    >
                                        +{category.certifications.length - 4} more certifications
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Empty state for categories with no certifications */}
                        {category.certifications.length === 0 && (
                            <div className="text-center py-8 text-slate-500">
                                <div className="bg-white/50 rounded-lg p-4">
                                    <p className="text-sm">No certifications available</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
