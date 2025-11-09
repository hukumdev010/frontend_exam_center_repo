"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { CategoryService } from "./services";
import { PaginatedCertifications, Category } from "./types";
import {
    CategoryHeader,
    CertificationsGrid,
    PaginationControls,
    LoadingSpinner,
    ErrorMessage
} from "./components";


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
            const data = await CategoryService.getCategoryCertifications(categorySlug, page, 12);
            setCertifications(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [categorySlug]);

    const fetchCategory = useCallback(async () => {
        try {
            const foundCategory = await CategoryService.findCategoryBySlug(categorySlug);
            setCategory(foundCategory);
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
        router.push(`/quiz/${slug}/info`);
    };

    if (loading && !certifications) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage error={error} onRetry={() => window.location.reload()} />;
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-7xl mx-auto p-6">
                <CategoryHeader
                    category={category}
                    certifications={certifications}
                    onBack={() => router.back()}
                />

                {certifications && (
                    <>
                        <CertificationsGrid
                            certifications={certifications}
                            onCertificationClick={handleCertificationClick}
                        />

                        <PaginationControls
                            certifications={certifications}
                            currentPage={currentPage}
                            loading={loading}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
