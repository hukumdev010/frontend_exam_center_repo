"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Category, PaginatedCertifications } from "../types";

interface CategoryHeaderProps {
    category: Category | null;
    certifications: PaginatedCertifications | null;
    onBack: () => void;
}

export default function CategoryHeader({ category, certifications, onBack }: CategoryHeaderProps) {
    const getIconComponent = (iconName: string) => {
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
                return 'from-orange-50 to-orange-100 border-orange-200';
            case 'blue':
                return 'from-blue-50 to-blue-100 border-blue-200';
            case 'purple':
                return 'from-purple-50 to-purple-100 border-purple-200';
            case 'green':
                return 'from-green-50 to-green-100 border-green-200';
            default:
                return 'from-slate-50 to-slate-100 border-slate-200';
        }
    };

    return (
        <div className="mb-8">
            <Button
                variant="outline"
                onClick={onBack}
                className="mb-6 bg-white/80 backdrop-blur-sm hover:bg-white"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
            </Button>

            {category && (
                <div className={`bg-gradient-to-r ${getCategoryColor(category.color)} rounded-2xl border-2 p-8 mb-8`}>
                    <div className="flex items-center">
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mr-6 shadow-sm">
                            <span className="text-4xl">{getIconComponent(category.icon)}</span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">{category.name}</h1>
                            <p className="text-slate-700 text-lg">{category.description}</p>
                            {certifications && (
                                <p className="text-slate-600 mt-2">
                                    {certifications.total} certifications available
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}