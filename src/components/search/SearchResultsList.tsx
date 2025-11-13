"use client";

import { Button } from "@/components/ui/button";
import { Users, BookOpen, ChevronRight, Star } from "lucide-react";
import { SearchResponse, TeacherSearchResponse, SearchTab } from "@/types/category-browser";
import { useRouter } from "next/navigation";

interface SearchResultsListProps {
    searchResults: SearchResponse | null;
    teacherResults: TeacherSearchResponse | null;
    searchLoading: boolean;
    activeTab: SearchTab;
    searchQuery: string;
    onClearSearch: () => void;
}

export function SearchResultsList({
    searchResults,
    teacherResults,
    searchLoading,
    activeTab,
    searchQuery,
    onClearSearch
}: SearchResultsListProps) {
    const router = useRouter();

    const handleCertificationClick = (slug: string) => {
        router.push(`/quiz/${slug}/info`);
    };

    const handleTeacherClick = (teacherId: number) => {
        router.push(`/teacher/${teacherId}`);
    };

    const getResultsCount = () => {
        if (activeTab === "certifications") {
            return searchResults?.certifications?.length || 0;
        }
        return teacherResults?.teachers?.length || 0;
    };

    const hasResults = () => {
        if (activeTab === "certifications") {
            return searchResults?.certifications && searchResults.certifications.length > 0;
        }
        return teacherResults?.teachers && teacherResults.teachers.length > 0;
    };

    if (searchLoading) {
        return (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 w-full max-w-7xl mx-auto">
                <div className="mb-8 text-center">
                    <div className="h-7 bg-gray-200 rounded w-56 mx-auto mb-3 animate-pulse"></div>
                    <div className="h-5 bg-gray-200 rounded w-72 mx-auto animate-pulse"></div>
                </div>

                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="rounded-xl border border-gray-200/50 p-4 bg-gradient-to-br from-white to-gray-50/50 animate-pulse">
                            <div className="flex items-start mb-3">
                                <div className="flex items-center gap-2 flex-1">
                                    <div className="relative">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                        <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gray-300 rounded-full"></div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2 mb-3">
                                <div className="h-2 bg-gray-200 rounded w-full"></div>
                                <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                            </div>
                            <div className="h-3 bg-gray-200 rounded w-20"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!hasResults() && (searchResults || teacherResults)) {
        return (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 w-full max-w-7xl mx-auto">
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        Search Results for &quot;{searchQuery}&quot;
                    </h2>
                    <p className="text-gray-600 text-lg">
                        {activeTab === "certifications" ? "Certifications" : "Teachers"}
                    </p>
                </div>

                <div className="text-center py-12">
                    <div className="text-gray-400 mb-6">
                        {activeTab === "certifications" ? (
                            <BookOpen className="h-16 w-16 mx-auto" />
                        ) : (
                            <Users className="h-16 w-16 mx-auto" />
                        )}
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-3">
                        No {activeTab === "certifications" ? "Certifications" : "Teachers"} Found
                    </h3>
                    <p className="text-gray-600 text-lg mb-6">
                        Try searching with different keywords or browse our categories.
                    </p>
                    <Button onClick={onClearSearch} variant="outline">
                        Clear Search
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 w-full max-w-7xl mx-auto">
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Search Results for &quot;{searchQuery}&quot;
                </h2>
                <p className="text-gray-600 text-lg">
                    Found {getResultsCount()} {activeTab === "certifications" ? "certifications" : "teachers"}
                </p>
            </div>

            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                        {getResultsCount()} {activeTab === "certifications" ? "certifications" : "teachers"} found
                    </span>
                </div>
                <Button
                    variant="outline"
                    className="hidden md:flex items-center gap-2 text-sm"
                    onClick={onClearSearch}
                >
                    Clear Search
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            {/* Certification Results */}
            {hasResults() && activeTab === "certifications" && searchResults && (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6">
                    {searchResults.certifications.map((cert) => (
                        <div
                            key={cert.id}
                            className="group bg-gradient-to-br from-white to-blue-50/50 rounded-xl border border-blue-200/50 p-6 
                                     shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer 
                                     hover:scale-105 transform hover:border-blue-300 min-h-[280px] flex flex-col"
                            onClick={() => handleCertificationClick(cert.slug)}
                        >
                            <div className="flex items-start mb-4">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="relative flex-shrink-0">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl 
                                                      flex items-center justify-center text-white">
                                            <BookOpen className="w-6 h-6" />
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full 
                                                      flex items-center justify-center">
                                            <Star className="w-3 h-3 text-white fill-current" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 
                                                     transition-colors duration-300 leading-tight break-words"
                                            style={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'visible'
                                            }}>
                                            {cert.name}
                                        </h3>
                                        {cert.category && (
                                            <p className="text-sm text-blue-600 font-medium mt-1 break-words">
                                                {cert.category.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 space-y-3 mb-4">
                                {cert.description && (
                                    <p className="text-sm text-gray-600 leading-relaxed break-words"
                                        style={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                        {cert.description}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-3 mt-auto">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-medium">
                                        {cert.level}
                                    </span>
                                    <span className="text-sm text-gray-600 font-medium">
                                        {cert.questions_count} questions
                                    </span>
                                </div>
                                {cert.duration && (
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
                                        <span className="text-sm text-gray-700 font-medium">
                                            🕒 {cert.duration} minutes
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Teacher Results */}
            {hasResults() && activeTab === "teachers" && teacherResults && (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6">
                    {teacherResults.teachers.map((teacher) => (
                        <div
                            key={teacher.id}
                            className="group bg-gradient-to-br from-white to-green-50/50 rounded-xl border border-green-200/50 p-6 
                                     shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer 
                                     hover:scale-105 transform hover:border-green-300 min-h-[280px] flex flex-col"
                            onClick={() => handleTeacherClick(teacher.id)}
                        >
                            <div className="flex items-start mb-4">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="relative shrink-0">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full 
                                                      flex items-center justify-center text-white font-bold text-lg">
                                            {(teacher.user_name || teacher.user_email)?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-semibold text-gray-900 group-hover:text-green-600 
                                                     transition-colors duration-300 leading-tight break-words"
                                            style={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'visible'
                                            }}>
                                            {teacher.user_name || "Anonymous Teacher"}
                                        </h3>
                                        {teacher.user_email && (
                                            <p className="text-sm text-green-600 font-medium mt-1 break-words">
                                                {teacher.user_email}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 space-y-3 mb-4">
                                {teacher.bio && (
                                    <p className="text-sm text-gray-600 leading-relaxed break-words"
                                        style={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                        {teacher.bio}
                                    </p>
                                )}
                                <div className="flex items-center space-x-2">
                                    <Users className="w-4 h-4 text-green-500" />
                                    <span className="text-sm text-gray-600">Professional Teacher</span>
                                </div>
                            </div>

                            <div className="space-y-3 mt-auto">
                                <div className="flex items-center justify-between">
                                    <span className={`text-sm px-3 py-1.5 rounded-full font-medium ${teacher.is_available
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {teacher.is_available ? '✓ Available' : '○ Busy'}
                                    </span>
                                    {teacher.experience_years && (
                                        <span className="text-sm text-gray-600">
                                            {teacher.experience_years}+ years
                                        </span>
                                    )}
                                </div>
                                {teacher.hourly_rate_one_on_one && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                                        <span className="text-sm text-green-700 font-medium">
                                            💰 ${teacher.hourly_rate_one_on_one}/hour
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="text-center md:hidden mt-8">
                <Button
                    variant="outline"
                    className="flex items-center gap-2 mx-auto text-sm"
                    onClick={onClearSearch}
                >
                    Clear Search
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}