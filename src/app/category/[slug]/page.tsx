"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api-config";

interface Certification {
    id: number;
    name: string;
    description: string;
    slug: string;
    level: string;
    duration: number;
    questions_count: number;
    is_active: boolean;
    category_id: number;
}

interface PaginatedCertifications {
    certifications: Certification[];
    total: number;
    page: number;
    per_page: number;
    has_next: boolean;
    has_prev: boolean;
}

interface Category {
    id: number;
    name: string;
    description: string;
    slug: string;
    icon: string;
    color: string;
}

export default function CategoryPage() {
    const params = useParams();
    const router = useRouter();
    const categorySlug = params.slug as string;

    const [certifications, setCertifications] = useState<PaginatedCertifications | null>(null);
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchCertifications = useCallback(async (page: number) => {
        try {
            setLoading(true);
            const response = await fetch(
                `${API_ENDPOINTS.categoryCertifications(categorySlug)}?page=${page}&per_page=12`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch certifications');
            }

            const data = await response.json();
            setCertifications(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [categorySlug]);

    const fetchCategory = useCallback(async () => {
        try {
            const response = await fetch(API_ENDPOINTS.categories);
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }

            const categories = await response.json();
            const foundCategory = categories.find((cat: Category) => cat.slug === categorySlug);
            setCategory(foundCategory || null);
        } catch (err) {
            console.error('Error fetching category:', err);
        }
    }, [categorySlug]);

    useEffect(() => {
        fetchCategory();
        fetchCertifications(currentPage);
    }, [fetchCategory, fetchCertifications, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleCertificationClick = (slug: string) => {
        router.push(`/quiz/${slug}`);
    };

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

    if (loading && !certifications) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-slate-600">Loading certifications...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <p className="text-red-600 mb-4">Error: {error}</p>
                            <Button onClick={() => window.location.reload()}>
                                Try Again
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
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

                {/* Certifications Grid */}
                {certifications && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                            {certifications.certifications.map((cert) => (
                                <div
                                    key={cert.id}
                                    className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-white/50 p-6 
                                             shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer 
                                             hover:bg-white/90 hover:-translate-y-1"
                                    onClick={() => handleCertificationClick(cert.slug)}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-slate-900 leading-tight line-clamp-2 flex-1">
                                            {cert.name}
                                        </h3>
                                        <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full ml-3 flex-shrink-0">
                                            {cert.level}
                                        </span>
                                    </div>

                                    {cert.description && (
                                        <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                                            {cert.description}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between text-sm text-slate-500">
                                        <span className="flex items-center">
                                            <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                                            {cert.questions_count} Questions
                                        </span>
                                        <span className="flex items-center">
                                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                                            {cert.duration} Min
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {certifications.total > certifications.per_page && (
                            <div className="flex items-center justify-center space-x-4">
                                <Button
                                    variant="outline"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={!certifications.has_prev || loading}
                                    className="bg-white/80 backdrop-blur-sm hover:bg-white"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-2" />
                                    Previous
                                </Button>

                                <div className="flex items-center space-x-2">
                                    {Array.from({ length: Math.ceil(certifications.total / certifications.per_page) }, (_, i) => {
                                        const page = i + 1;
                                        const showPage = page === 1 ||
                                            page === Math.ceil(certifications.total / certifications.per_page) ||
                                            Math.abs(page - currentPage) <= 2;

                                        if (!showPage) {
                                            if (page === 2 && currentPage > 4) {
                                                return <span key={page} className="text-slate-500">...</span>;
                                            }
                                            if (page === Math.ceil(certifications.total / certifications.per_page) - 1 &&
                                                currentPage < Math.ceil(certifications.total / certifications.per_page) - 3) {
                                                return <span key={page} className="text-slate-500">...</span>;
                                            }
                                            return null;
                                        }

                                        return (
                                            <Button
                                                key={page}
                                                variant={page === currentPage ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => handlePageChange(page)}
                                                disabled={loading}
                                                className="bg-white/80 backdrop-blur-sm hover:bg-white"
                                            >
                                                {page}
                                            </Button>
                                        );
                                    })}
                                </div>

                                <Button
                                    variant="outline"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={!certifications.has_next || loading}
                                    className="bg-white/80 backdrop-blur-sm hover:bg-white"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        )}

                        {certifications.certifications.length === 0 && (
                            <div className="text-center py-16">
                                <div className="bg-white/50 rounded-xl p-8 max-w-md mx-auto">
                                    <p className="text-slate-600 text-lg">No certifications found in this category.</p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
