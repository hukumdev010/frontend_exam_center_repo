import { BookOpen, Users, ChevronRight } from "lucide-react";

interface QuickActionsProps {
    activeTab: 'certifications' | 'teachers';
}

export default function QuickActions({ activeTab }: QuickActionsProps) {
    return (
        <div className="space-y-3">
            {activeTab === 'certifications' ? (
                <button className="w-full group px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Browse Certifications
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            ) : (
                <button className="w-full group px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2">
                    <Users className="w-4 h-4" />
                    Find Teachers
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            )}
        </div>
    );
}