import { BookOpen } from "lucide-react";
import { Certification } from "@/types/category-browser";

interface CertificationCardProps {
    certification: Certification;
    onClick: (slug: string) => void;
}

export function CertificationCard({ certification: cert, onClick }: CertificationCardProps) {
    return (
        <div
            className="group bg-gradient-to-br from-white to-indigo-50/30 rounded-2xl border border-indigo-100/50 p-6 
                     shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer 
                     hover:scale-105 transform hover:border-indigo-200"
            onClick={() => onClick(cert.slug)}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl 
                                  flex items-center justify-center text-white">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 
                                     transition-colors duration-300 line-clamp-2 leading-tight">
                            {cert.name}
                        </h3>
                        {cert.category && (
                            <div className="flex items-center space-x-1 mt-1">
                                <span className="text-xs text-indigo-600 font-medium">
                                    {cert.category.name}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <span className="text-xs bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 
                               px-3 py-1.5 rounded-full font-medium border border-indigo-200 flex-shrink-0">
                    {cert.level}
                </span>
            </div>

            {cert.description && (
                <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                    {cert.description}
                </p>
            )}

            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-indigo-600">{cert.questions_count}</div>
                        <div className="text-xs text-indigo-700 font-medium">Questions</div>
                    </div>
                    <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-purple-600">{cert.duration}</div>
                        <div className="text-xs text-purple-700 font-medium">Minutes</div>
                    </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                    <span className="text-sm text-slate-600 font-medium">
                        🏆 Get Certified in {cert.name}
                    </span>
                </div>
            </div>
        </div>
    );
}