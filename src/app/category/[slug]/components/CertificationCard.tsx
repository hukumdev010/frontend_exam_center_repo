"use client";

interface Certification {
    id: number;
    name: string;
    slug: string;
    description?: string;
    level: string;
    questions_count: number;
    duration: number;
}

interface CertificationCardProps {
    certification: Certification;
    onClick: (slug: string) => void;
}

export default function CertificationCard({ certification, onClick }: CertificationCardProps) {
    return (
        <div
            className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-white/50 p-6 
                     shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer 
                     hover:bg-white/90 hover:-translate-y-1"
            onClick={() => onClick(certification.slug)}
        >
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 leading-tight line-clamp-2 flex-1">
                    {certification.name}
                </h3>
                <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full ml-3 flex-shrink-0">
                    {certification.level}
                </span>
            </div>

            {certification.description && (
                <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                    {certification.description}
                </p>
            )}

            <div className="flex items-center justify-between text-sm text-slate-500">
                <span className="flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                    {certification.questions_count} Questions
                </span>
                <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    {certification.duration} Min
                </span>
            </div>
        </div>
    );
}