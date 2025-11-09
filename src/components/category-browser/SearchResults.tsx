import { useRouter } from "next/navigation";
import { SearchResponse, TeacherSearchResponse, SearchTab } from "@/types/category-browser";
import { LoadingSpinner } from "./LoadingSpinner";
import { SearchResultsHeader } from "./SearchResultsHeader";
import { CertificationCard } from "./CertificationCard";
import { TeacherCard } from "./TeacherCard";
import { NoResults } from "./NoResults";

interface SearchResultsProps {
    searchResults: SearchResponse | null;
    teacherResults: TeacherSearchResponse | null;
    searchLoading: boolean;
    activeTab: SearchTab;
    searchQuery: string;
    onClearSearch: () => void;
}

export function SearchResults({
    searchResults,
    teacherResults,
    searchLoading,
    activeTab,
    searchQuery,
    onClearSearch
}: SearchResultsProps) {
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

    const showNoResults = () => {
        if (activeTab === "certifications") {
            return searchResults && (!searchResults.certifications || searchResults.certifications.length === 0);
        }
        return teacherResults && (!teacherResults.teachers || teacherResults.teachers.length === 0);
    };

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
            <SearchResultsHeader
                activeTab={activeTab}
                searchQuery={searchQuery}
                resultsCount={getResultsCount()}
                onClear={onClearSearch}
            />

            {searchLoading ? (
                <LoadingSpinner message="Searching..." />
            ) : (
                <>
                    {/* Certification Results */}
                    {hasResults() && activeTab === "certifications" && searchResults && (
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {searchResults.certifications.map((cert) => (
                                <CertificationCard
                                    key={cert.id}
                                    certification={cert}
                                    onClick={handleCertificationClick}
                                />
                            ))}
                        </div>
                    )}

                    {/* Teacher Results */}
                    {hasResults() && activeTab === "teachers" && teacherResults && (
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {teacherResults.teachers.map((teacher) => (
                                <TeacherCard
                                    key={teacher.id}
                                    teacher={teacher}
                                    onClick={handleTeacherClick}
                                />
                            ))}
                        </div>
                    )}

                    {/* No Results */}
                    {showNoResults() && (
                        <NoResults activeTab={activeTab} searchQuery={searchQuery} />
                    )}
                </>
            )}
        </div>
    );
}