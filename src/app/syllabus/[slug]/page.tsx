"use client";

import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import {
    SyllabusTopic,
    isStructuredSyllabus,
    isLegacySyllabus,
    LegacySyllabusData,
    StructuredSyllabusData
} from "@/types/syllabus";
import { SyllabusSidebar, SyllabusContent } from "@/components/syllabus";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useSyllabus } from "@/hooks/useSyllabus";

// Helper function to convert legacy topic to structured topic
function convertLegacyToStructured(legacySyllabus: LegacySyllabusData): StructuredSyllabusData {
    return {
        certification_id: 0, // Will be filled from response
        certification_name: legacySyllabus.courseOverview.title,
        certification_slug: '', // Will be filled from response
        modules: legacySyllabus.modules.map((legacyModule, index) => ({
            id: index + 1,
            moduleNumber: legacyModule.moduleNumber,
            title: legacyModule.title,
            description: '',
            duration: legacyModule.duration,
            topics: legacyModule.topics.map((topic, topicIndex) => {
                if (typeof topic === 'string') {
                    return {
                        id: topicIndex + 1,
                        title: topic,
                        description: '',
                        estimatedDuration: '',
                        videoStatus: 'planned' as const,
                    };
                } else {
                    return {
                        id: topicIndex + 1,
                        title: topic.title,
                        description: '',
                        introduction: topic.content?.introduction || '',
                        estimatedDuration: '',
                        videoStatus: 'planned' as const,
                        content: topic.content,
                        detailed_content: topic.detailed_content,
                    };
                }
            }),
            learningObjectives: legacyModule.learningObjectives,
        })),
    };
}

export default function SyllabusPage() {
    const params = useParams();
    const slug = params.slug as string;

    // Use SWR hook for data fetching
    const { data: syllabusData, error, isLoading } = useSyllabus(slug);

    // Convert legacy syllabus to structured format if needed
    const convertedSyllabusData = useMemo(() => {
        if (!syllabusData || !syllabusData.syllabus) return syllabusData;

        if (isLegacySyllabus(syllabusData.syllabus)) {
            const converted = convertLegacyToStructured(syllabusData.syllabus);
            converted.certification_id = syllabusData.certification_id;
            converted.certification_slug = syllabusData.certification_slug;
            return {
                ...syllabusData,
                syllabus: converted
            };
        }

        return syllabusData;
    }, [syllabusData]);

    // Get the first available topic
    const firstAvailableTopic = convertedSyllabusData?.syllabus && isStructuredSyllabus(convertedSyllabusData.syllabus) && convertedSyllabusData.syllabus.modules.length > 0
        ? convertedSyllabusData.syllabus.modules[0].topics[0] || null
        : null;

    const [selectedTopic, setSelectedTopic] = useState<SyllabusTopic | null>(null);
    // Sidebar collapse state
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Use the first available topic as fallback if none is selected
    const currentTopic = selectedTopic || firstAvailableTopic;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading syllabus...</p>
                </div>
            </div>
        );
    }

    if (error || !convertedSyllabusData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <CardTitle>Error Loading Syllabus</CardTitle>
                        <CardDescription>{error || "Syllabus not found"}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-sm text-gray-500">Please try refreshing the page or contact support if the problem persists.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!convertedSyllabusData.has_access || !convertedSyllabusData.syllabus) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <CardTitle>Access Restricted</CardTitle>
                        <CardDescription>
                            {convertedSyllabusData.message || "You don't have access to this syllabus."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        {convertedSyllabusData.access_message && (
                            <p className="text-sm text-blue-600 mb-4">{convertedSyllabusData.access_message}</p>
                        )}
                        <p className="text-sm text-gray-500">Please ensure you have the proper permissions to access this syllabus.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            {/* Left Sidebar with Header */}
            <div className={`${isCollapsed ? 'w-8' : 'w-96'} bg-white border-r border-gray-200 shrink-0 flex flex-col overflow-hidden relative transition-all duration-200`}>
                {/* Header inside sidebar - only show when expanded */}
                {!isCollapsed && (
                    <div className="bg-blue-500 text-white p-6 border-b border-blue-400">
                        <div>
                            <h1 className="text-xl font-bold mb-2">
                                {convertedSyllabusData.certification_name}
                            </h1>
                            <div className="flex flex-col gap-1 text-blue-50">
                                {convertedSyllabusData.category?.name && (
                                    <span className="text-sm">📚 {convertedSyllabusData.category.name}</span>
                                )}
                                <span className="text-sm">🎓 {convertedSyllabusData.certification_level}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Collapse toggle button */}
                <button
                    aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-4 z-20 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    ) : (
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    )}
                </button>

                {/* Sidebar Content (hidden when collapsed) */}
                <div className="flex-1 overflow-y-auto">
                    {!isCollapsed && currentTopic && (
                        <SyllabusSidebar
                            syllabusData={convertedSyllabusData}
                            selectedTopic={currentTopic}
                            onTopicSelect={setSelectedTopic}
                        />
                    )}
                </div>
            </div>

            {/* Right Content Area with better spacing and white background */}
            <div className="flex-1 overflow-y-auto bg-white">
                <div className="p-8 max-w-7xl mx-auto w-full">
                    {currentTopic ? (
                        <SyllabusContent
                            selectedTopic={currentTopic}
                            syllabusData={convertedSyllabusData}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No Topic Available</h3>
                                <p className="text-gray-500">This syllabus doesn&apos;t have any topics yet.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}