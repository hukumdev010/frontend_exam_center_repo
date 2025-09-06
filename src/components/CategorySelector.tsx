"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { BookOpen, ArrowRight, Award, Code, Server, Terminal, Cloud } from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api-config";

type Category = {
    id: number;
    name: string;
    description: string;
    slug: string;
    icon: string;
    color: string;
    certifications: Certification[];
};

type Certification = {
    id: number;
    name: string;
    description: string;
    slug: string;
    level: string;
    duration: number;
    questions_count: number;
};

interface CategorySelectorProps {
    onCertificationSelect: (certificationSlug: string) => void;
}

export function CategorySelector({ onCertificationSelect }: CategorySelectorProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.categories);
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            setCategories(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const getIconComponent = (iconName: string) => {
        switch (iconName) {
            case 'aws':
                return <Cloud className="w-6 h-6 text-slate-600 mr-2" />;
            case 'code':
                return <Code className="w-6 h-6 text-slate-600 mr-2" />;
            case 'server':
                return <Server className="w-6 h-6 text-slate-600 mr-2" />;
            case 'terminal':
                return <Terminal className="w-6 h-6 text-slate-600 mr-2" />;
            default:
                return <BookOpen className="w-6 h-6 text-slate-600 mr-2" />;
        }
    };

    const getCategoryColor = (color: string) => {
        switch (color) {
            case 'orange':
                return 'border-orange-200 bg-orange-50 hover:bg-orange-100';
            case 'blue':
                return 'border-blue-200 bg-blue-50 hover:bg-blue-100';
            case 'purple':
                return 'border-purple-200 bg-purple-50 hover:bg-purple-100';
            case 'green':
                return 'border-green-200 bg-green-50 hover:bg-green-100';
            default:
                return 'border-slate-200 bg-white hover:bg-slate-50';
        }
    };

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

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 py-8">
                <div className="max-w-4xl mx-auto p-6">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-slate-600">Loading certification categories...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 py-8">
                <div className="max-w-4xl mx-auto p-6">
                    <div className="text-center">
                        <p className="text-red-600">Error: {error}</p>
                        <Button onClick={fetchCategories} className="mt-4">
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-6xl mx-auto p-6">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <Award className="w-12 h-12 text-blue-600 mr-3" />
                        <h1 className="text-4xl font-bold text-slate-900">Certification Center</h1>
                    </div>
                    <p className="text-xl text-slate-600">
                        Choose your certification path and start practicing
                    </p>
                </div>

                <div className="space-y-8">
                    {categories.map((category) => (
                        <div key={category.id} className={`rounded-lg border-2 p-6 transition-all ${getCategoryColor(category.color)}`}>
                            <div className="flex items-center mb-4">
                                {getIconComponent(category.icon)}
                                <h2 className="text-2xl font-bold text-slate-900">{category.name}</h2>
                            </div>

                            <p className="text-slate-600 mb-6">{category.description}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {category.certifications.map((cert) => (
                                    <div
                                        key={cert.id}
                                        className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(cert.level)}`}>
                                                {cert.level}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-semibold text-slate-900 mb-2 leading-tight">
                                            {cert.name}
                                        </h3>

                                        <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                                            {cert.description}
                                        </p>

                                        <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                                            <span>{cert.questions_count} Questions</span>
                                            <span>{cert.duration} Minutes</span>
                                        </div>

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

                            {category.certifications.length === 0 && (
                                <div className="text-center py-8 text-slate-500">
                                    <p>No certifications available in this category yet.</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-slate-500 text-sm">
                        Practice exams are designed to help you prepare for real certifications.
                        Questions are based on actual exam topics and scenarios.
                    </p>
                </div>
            </div>
        </div>
    );
}
