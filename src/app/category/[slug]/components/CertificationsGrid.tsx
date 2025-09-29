"use client";

import CertificationCard from "./CertificationCard";
import { PaginatedCertifications } from "../types";

interface CertificationsGridProps {
    certifications: PaginatedCertifications;
    onCertificationClick: (slug: string) => void;
}

export default function CertificationsGrid({ certifications, onCertificationClick }: CertificationsGridProps) {
    if (certifications.certifications.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="bg-white/50 rounded-xl p-8 max-w-md mx-auto">
                    <p className="text-slate-600 text-lg">No certifications found in this category.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {certifications.certifications.map((cert) => (
                <CertificationCard
                    key={cert.id}
                    certification={cert}
                    onClick={onCertificationClick}
                />
            ))}
        </div>
    );
}