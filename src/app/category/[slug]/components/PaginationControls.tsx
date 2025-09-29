"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginatedCertifications } from "../types";

interface PaginationControlsProps {
    certifications: PaginatedCertifications;
    currentPage: number;
    loading: boolean;
    onPageChange: (page: number) => void;
}

export default function PaginationControls({
    certifications,
    currentPage,
    loading,
    onPageChange
}: PaginationControlsProps) {
    if (certifications.total <= certifications.per_page) {
        return null;
    }

    const totalPages = Math.ceil(certifications.total / certifications.per_page);

    return (
        <div className="flex items-center justify-center space-x-4">
            <Button
                variant="outline"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!certifications.has_prev || loading}
                className="bg-white/80 backdrop-blur-sm hover:bg-white"
            >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
            </Button>

            <div className="flex items-center space-x-2">
                {Array.from({ length: totalPages }, (_, i) => {
                    const page = i + 1;
                    const showPage = page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 2;

                    if (!showPage) {
                        if (page === 2 && currentPage > 4) {
                            return <span key={page} className="text-slate-500">...</span>;
                        }
                        if (page === totalPages - 1 && currentPage < totalPages - 3) {
                            return <span key={page} className="text-slate-500">...</span>;
                        }
                        return null;
                    }

                    return (
                        <Button
                            key={page}
                            variant={page === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => onPageChange(page)}
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
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!certifications.has_next || loading}
                className="bg-white/80 backdrop-blur-sm hover:bg-white"
            >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
        </div>
    );
}