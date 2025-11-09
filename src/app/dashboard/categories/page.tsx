"use client";

import { useState } from "react";
import { CertificationSearchSection } from "@/components/search/CertificationSearchSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Star } from "lucide-react";
import Link from "next/link";
import { useCategoriesWithCertifications } from "@/hooks/useApi";

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    certification_count?: number;
    total_enrollments?: number;
    average_rating?: number;
}

export default function BrowseSubjectsPage() {
    const [hasSearchResults, setHasSearchResults] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Use SWR hook for data fetching
    const { data: categories = [], isLoading: loading, error } = useCategoriesWithCertifications();

    const paginatedCategories = categories.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(categories.length / itemsPerPage);

    if (loading && !hasSearchResults) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error && !hasSearchResults) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-600">Error loading categories. Please try refreshing the page.</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Subjects</h1>
                    <p className="text-gray-600">
                        Discover and explore various certification categories
                    </p>
                </div>

                {/* Certification Search Section */}
                <CertificationSearchSection onSearchStateChange={setHasSearchResults} />

                {/* Original Categories Grid - only show when no search results */}
                {!hasSearchResults && (
                    <>
                        {/* Categories Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 mt-8">
                            {paginatedCategories.map((category: Category) => (
                                <Link key={category.id} href={`/category/${category.slug}`}>
                                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <BookOpen className="h-6 w-6 text-blue-600" />
                                                {category.average_rating && (
                                                    <div className="flex items-center gap-1">
                                                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                                        <span className="text-sm text-gray-600">
                                                            {category.average_rating.toFixed(1)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <CardTitle className="text-lg">{category.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription className="mb-4 line-clamp-3">
                                                {category.description || "No description available"}
                                            </CardDescription>
                                            <div className="flex flex-wrap gap-2">
                                                {category.certification_count !== undefined && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        {category.certification_count} Certifications
                                                    </Badge>
                                                )}
                                                {category.total_enrollments !== undefined && (
                                                    <Badge variant="outline" className="text-xs">
                                                        <Users className="h-3 w-3 mr-1" />
                                                        {category.total_enrollments} Students
                                                    </Badge>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2">
                                <Button
                                    variant="outline"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                >
                                    Previous
                                </Button>
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter(page =>
                                            page === 1 ||
                                            page === totalPages ||
                                            (page >= currentPage - 1 && page <= currentPage + 1)
                                        )
                                        .map((page, index, array) => (
                                            <div key={page}>
                                                {index > 0 && array[index - 1] !== page - 1 && (
                                                    <span className="px-2">...</span>
                                                )}
                                                <Button
                                                    variant={currentPage === page ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setCurrentPage(page)}
                                                >
                                                    {page}
                                                </Button>
                                            </div>
                                        ))}
                                </div>
                                <Button
                                    variant="outline"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        )}

                        {/* Empty State */}
                        {categories.length === 0 && !loading && (
                            <Card className="text-center py-12 mt-8">
                                <CardContent>
                                    <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <CardTitle className="mb-2">No subjects found</CardTitle>
                                    <CardDescription>
                                        No subjects are available at the moment.
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}