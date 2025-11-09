"use client"

import {
    User,
    Clock,
    GraduationCap,
    MapPin,
} from "lucide-react";

interface TeacherQualification {
    id: number;
    certification_name: string;
    category_name: string;
    score: number;
    qualified_at: string;
}

interface TeacherCardProps {
    id: number;
    user_name?: string;
    user_email?: string;
    bio?: string;
    experience_years?: number;
    qualifications?: TeacherQualification[];
    status: 'pending' | 'approved' | 'rejected';
    is_available: boolean;
    hourly_rate_one_on_one?: number;
    hourly_rate_group?: number;
    max_group_size?: number;
    languages_spoken?: string;
    onClick?: () => void;
}

export default function TeacherCard({
    user_name,
    user_email,
    bio,
    experience_years,
    qualifications,
    status,
    is_available,
    hourly_rate_one_on_one,
    languages_spoken,
    onClick
}: TeacherCardProps) {

    const getStatusIndicator = (status: string, isAvailable: boolean) => {
        if (status === "approved" && isAvailable) {
            return (
                <div className="relative group" title="Available for sessions">
                    <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                    <div className="absolute top-0 left-0 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                    {/* Tooltip */}
                    <div className="absolute -top-8 -left-8 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                        Available
                    </div>
                </div>
            );
        }
        if (status === "approved" && !isAvailable) {
            return (
                <div className="relative group" title="Currently busy">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow-sm"></div>
                    {/* Tooltip */}
                    <div className="absolute -top-8 -left-4 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                        Busy
                    </div>
                </div>
            );
        }
        return (
            <div className="relative group" title="Offline">
                <div className="w-4 h-4 bg-gray-400 rounded-full border-2 border-white shadow-sm"></div>
                {/* Tooltip */}
                <div className="absolute -top-8 -left-6 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    Offline
                </div>
            </div>
        );
    };

    const formatRate = (rate?: number) => {
        if (!rate) return "Contact for pricing";
        return `$${rate}/hour`;
    };

    return (
        <div
            className="group rounded-xl border border-gray-200/50 p-4 bg-gradient-to-br from-white to-gray-50/50 hover:shadow-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:border-blue-300/50"
            onClick={onClick}
        >
            <div className="flex items-start mb-3">
                <div className="flex items-center gap-2 flex-1">
                    <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {(user_name || user_email)?.charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute -top-0.5 -right-0.5">
                            {getStatusIndicator(status, is_available)}
                        </div>
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {user_name || user_email?.split('@')[0] || 'Teacher'}
                        </h4>
                    </div>
                </div>
            </div>

            {bio && (
                <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">
                    {bio}
                </p>
            )}

            <div className="space-y-2 mb-3">
                {experience_years && (
                    <div className="flex items-center gap-1.5">
                        <GraduationCap className="h-3 w-3 text-blue-500" />
                        <span className="text-xs text-gray-600">
                            {experience_years} years exp.
                        </span>
                    </div>
                )}

                {qualifications && qualifications.length > 0 && (
                    <div className="flex items-center gap-1.5">
                        <User className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-gray-600">
                            {qualifications.length} cert{qualifications.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                )}

                <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-purple-500" />
                    <span className="text-xs text-gray-600">
                        {formatRate(hourly_rate_one_on_one)}
                    </span>
                </div>

                {languages_spoken && (
                    <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-orange-500" />
                        <span className="text-xs text-gray-600 line-clamp-1">
                            {languages_spoken}
                        </span>
                    </div>
                )}
            </div>

            <div className="text-xs text-blue-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                View Profile
                <span className="text-blue-400 group-hover:translate-x-0.5 transition-transform">→</span>
            </div>
        </div>
    );
}