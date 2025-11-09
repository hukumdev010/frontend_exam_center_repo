"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
    BookOpen,
    Clock,
    Target,
    Users,
    CheckCircle,
    X,
    GraduationCap,
    Lightbulb,
    Trophy,
    Wrench,
    Play,
    Eye,
    ChevronRight
} from "lucide-react";
import {
    SyllabusResponse,
    SyllabusData,
    SyllabusTopic,
    isStructuredSyllabus,
    isLegacySyllabus
} from "@/types/syllabus";

interface SyllabusViewerProps {
    syllabusData: SyllabusResponse;
    onClose: () => void;
}

interface TopicDetailModalProps {
    topic: SyllabusTopic;
    isOpen: boolean;
    onClose: () => void;
}

function TopicDetailModal({ topic, isOpen, onClose }: TopicDetailModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
                <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Play className="w-5 h-5 text-blue-600" />
                                {topic.title}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                {topic.estimatedDuration && (
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {topic.estimatedDuration}
                                    </span>
                                )}
                                {topic.videoStatus && (
                                    <Badge variant={
                                        topic.videoStatus === 'published' ? 'default' :
                                            topic.videoStatus === 'recorded' ? 'secondary' :
                                                topic.videoStatus === 'scripted' ? 'outline' : 'destructive'
                                    }>
                                        {topic.videoStatus}
                                    </Badge>
                                )}
                            </CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="overflow-y-auto max-h-[70vh] space-y-6">
                    {topic.introduction && (
                        <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                Introduction
                            </h4>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{topic.introduction}</p>
                        </div>
                    )}

                    {topic.content?.key_points && (
                        <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <Target className="w-4 h-4" />
                                Key Points to Cover
                            </h4>
                            <ul className="space-y-2">
                                {topic.content.key_points.map((point, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                                        <span className="text-gray-700">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {topic.content?.practical_examples && (
                        <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <Lightbulb className="w-4 h-4" />
                                Practical Examples
                            </h4>
                            <div className="space-y-2">
                                {topic.content.practical_examples.map((example, index) => (
                                    <div key={index} className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                                        <p className="text-gray-700">{example}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {topic.content?.what_to_teach && (
                        <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <GraduationCap className="w-4 h-4" />
                                Video Creation Guide
                            </h4>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-sm text-yellow-800 mb-3 font-medium">
                                    Use this guide to create your YouTube video:
                                </p>
                                <ol className="space-y-2">
                                    {topic.content.what_to_teach.map((guide, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <span className="bg-yellow-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                                                {index + 1}
                                            </span>
                                            <span className="text-yellow-900">{guide}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    )}

                    {topic.videoUrl && (
                        <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <Play className="w-4 h-4" />
                                Video Content
                            </h4>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className="text-green-800 mb-2">Video is available!</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(topic.videoUrl, '_blank')}
                                    className="text-green-700 border-green-300 hover:bg-green-100"
                                >
                                    <Play className="w-4 h-4 mr-2" />
                                    Watch Video
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export function SyllabusViewer({ syllabusData, onClose }: SyllabusViewerProps) {
    const [activeTab, setActiveTab] = useState("overview");
    const [selectedTopic, setSelectedTopic] = useState<SyllabusTopic | null>(null);
    const syllabus = syllabusData.syllabus as SyllabusData;

    if (!syllabusData.has_access || !syllabus) {
        return (
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5" />
                                Syllabus Access
                            </CardTitle>
                        </div>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-medium mb-2">Syllabus Not Available</h3>
                        <p className="text-gray-600 mb-4">
                            {syllabusData.message || "You don't have access to this syllabus."}
                        </p>
                        {syllabusData.access_message && (
                            <p className="text-sm text-blue-600">{syllabusData.access_message}</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 z-50">
            <Card className="w-full max-w-7xl max-h-[95vh] overflow-hidden">
                <CardHeader className="px-8 py-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5" />
                                {syllabusData.certification_name}
                            </CardTitle>
                            <CardDescription>
                                {syllabusData.category?.name} • {syllabusData.certification_level}
                                {syllabusData.is_qualified_teacher && (
                                    <Badge variant="secondary" className="ml-2">
                                        <GraduationCap className="w-3 h-3 mr-1" />
                                        Qualified Teacher
                                    </Badge>
                                )}
                            </CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                        <div className="px-6 border-b">
                            <TabsList className="grid w-full grid-cols-5">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="modules">Modules</TabsTrigger>
                                <TabsTrigger value="exercises">Exercises</TabsTrigger>
                                <TabsTrigger value="assessment">Assessment</TabsTrigger>
                                <TabsTrigger value="resources">Resources</TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="h-[65vh] overflow-y-auto px-6 py-4">
                            <TabsContent value="overview" className="mt-0 space-y-6">
                                <div>
                                    {isStructuredSyllabus(syllabus) ? (
                                        <>
                                            <h3 className="text-xl font-bold mb-4">{syllabusData.certification_name}</h3>
                                            <p className="text-gray-700 mb-4">
                                                {syllabusData.certification_description || "Comprehensive course covering essential concepts and practical applications."}
                                            </p>
                                        </>
                                    ) : isLegacySyllabus(syllabus) ? (
                                        <>
                                            <h3 className="text-xl font-bold mb-4">{syllabus.courseOverview.title}</h3>
                                            <p className="text-gray-700 mb-4">{syllabus.courseOverview.description}</p>
                                        </>
                                    ) : (
                                        <>
                                            <h3 className="text-xl font-bold mb-4">{syllabusData.certification_name}</h3>
                                            <p className="text-gray-700 mb-4">Course syllabus information</p>
                                        </>
                                    )}

                                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                                        <Card>
                                            <CardContent className="p-4 text-center">
                                                <Clock className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                                                <p className="font-medium">Duration</p>
                                                <p className="text-sm text-gray-600">
                                                    {isLegacySyllabus(syllabus)
                                                        ? syllabus.courseOverview.duration
                                                        : 'Varies by module'
                                                    }
                                                </p>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent className="p-4 text-center">
                                                <Target className="w-6 h-6 mx-auto mb-2 text-green-600" />
                                                <p className="font-medium">Difficulty</p>
                                                <p className="text-sm text-gray-600">
                                                    {isLegacySyllabus(syllabus)
                                                        ? syllabus.courseOverview.difficulty
                                                        : 'Intermediate'
                                                    }
                                                </p>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent className="p-4 text-center">
                                                <Users className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                                                <p className="font-medium">Modules</p>
                                                <p className="text-sm text-gray-600">{syllabus.modules.length} modules</p>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-3">Prerequisites</h4>
                                        <div className="space-y-2">
                                            {(isLegacySyllabus(syllabus) ? syllabus.courseOverview.prerequisites : []).map((prereq, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                    <span className="text-sm text-gray-700">{prereq}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="modules" className="mt-0 space-y-4">
                                {isStructuredSyllabus(syllabus) ? (
                                    // New structured syllabus format
                                    syllabus.modules.map((module, index) => (
                                        <Card key={module.id || index} className="border-l-4 border-l-blue-500">
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-start mb-3">
                                                    <h4 className="font-semibold text-lg">
                                                        Module {module.moduleNumber}: {module.title}
                                                    </h4>
                                                    <Badge variant="outline">{module.duration}</Badge>
                                                </div>

                                                {module.description && (
                                                    <p className="text-gray-600 mb-4">{module.description}</p>
                                                )}

                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div>
                                                        <h5 className="font-medium mb-2 flex items-center gap-2">
                                                            <BookOpen className="w-4 h-4" />
                                                            Topics ({module.topics.length})
                                                        </h5>
                                                        <div className="space-y-2">
                                                            {module.topics.map((topic, topicIndex) => (
                                                                <Button
                                                                    key={topic.id || topicIndex}
                                                                    variant="ghost"
                                                                    className="w-full justify-start p-2 h-auto text-left hover:bg-blue-50"
                                                                    onClick={() => setSelectedTopic(topic)}
                                                                >
                                                                    <div className="flex items-start gap-2 w-full">
                                                                        <div className="flex items-center gap-2 flex-1">
                                                                            <Eye className="w-4 h-4 text-blue-600 shrink-0" />
                                                                            <div className="flex-1">
                                                                                <p className="font-medium text-sm">{topic.title}</p>
                                                                                {topic.estimatedDuration && (
                                                                                    <p className="text-xs text-gray-500">{topic.estimatedDuration}</p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-1">
                                                                            {topic.videoStatus && (
                                                                                <Badge
                                                                                    variant={
                                                                                        topic.videoStatus === 'published' ? 'default' :
                                                                                            topic.videoStatus === 'recorded' ? 'secondary' :
                                                                                                topic.videoStatus === 'scripted' ? 'outline' : 'destructive'
                                                                                    }
                                                                                    className="text-xs"
                                                                                >
                                                                                    {topic.videoStatus}
                                                                                </Badge>
                                                                            )}
                                                                            <ChevronRight className="w-4 h-4 text-gray-400" />
                                                                        </div>
                                                                    </div>
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h5 className="font-medium mb-2 flex items-center gap-2">
                                                            <Target className="w-4 h-4" />
                                                            Learning Objectives
                                                        </h5>
                                                        <ul className="space-y-1">
                                                            {module.learningObjectives.map((objective, objIndex) => (
                                                                <li key={objIndex} className="text-sm text-gray-700 flex items-start gap-2">
                                                                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                                                                    {objective}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : isLegacySyllabus(syllabus) ? (
                                    // Legacy JSON syllabus format
                                    syllabus.modules.map((module, index) => (
                                        <Card key={index} className="border-l-4 border-l-blue-500">
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-start mb-3">
                                                    <h4 className="font-semibold text-lg">
                                                        Module {module.moduleNumber}: {module.title}
                                                    </h4>
                                                    <Badge variant="outline">{module.duration}</Badge>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div>
                                                        <h5 className="font-medium mb-2 flex items-center gap-2">
                                                            <BookOpen className="w-4 h-4" />
                                                            Topics Covered
                                                        </h5>
                                                        <ul className="space-y-1">
                                                            {module.topics.map((topic, topicIndex) => (
                                                                <li key={topicIndex} className="text-sm text-gray-700 flex items-start gap-2">
                                                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0"></span>
                                                                    {typeof topic === 'string' ? topic : topic.title}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    <div>
                                                        <h5 className="font-medium mb-2 flex items-center gap-2">
                                                            <Target className="w-4 h-4" />
                                                            Learning Objectives
                                                        </h5>
                                                        <ul className="space-y-1">
                                                            {module.learningObjectives.map((objective, objIndex) => (
                                                                <li key={objIndex} className="text-sm text-gray-700 flex items-start gap-2">
                                                                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                                                                    {objective}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                        <p className="text-gray-600">No modules available.</p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="exercises" className="mt-0">
                                {isLegacySyllabus(syllabus) && syllabus.practicalExercises && syllabus.practicalExercises.length > 0 ? (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold flex items-center gap-2">
                                            <Lightbulb className="w-5 h-5" />
                                            Practical Exercises
                                        </h3>
                                        <div className="grid gap-3">
                                            {syllabus.practicalExercises.map((exercise: string, index: number) => (
                                                <Card key={index} className="border-l-4 border-l-green-500">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-start gap-3">
                                                            <div className="bg-green-100 rounded-full p-2">
                                                                <span className="text-green-700 font-bold text-sm">{index + 1}</span>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">{exercise}</p>
                                                                <p className="text-sm text-gray-600 mt-1">
                                                                    Hands-on project to apply your learning
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Lightbulb className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                        <p className="text-gray-600">No practical exercises defined for this course.</p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="assessment" className="mt-0">
                                {isLegacySyllabus(syllabus) && syllabus.assessmentCriteria && syllabus.assessmentCriteria.length > 0 ? (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold flex items-center gap-2">
                                            <Trophy className="w-5 h-5" />
                                            Assessment Criteria
                                        </h3>
                                        <div className="space-y-3">
                                            {syllabus.assessmentCriteria.map((criteria: string, index: number) => (
                                                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                    <p className="text-gray-800">{criteria}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                        <p className="text-gray-600">No assessment criteria defined for this course.</p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="resources" className="mt-0 space-y-6">
                                {isLegacySyllabus(syllabus) && syllabus.recommendedReadings && syllabus.recommendedReadings.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                                            <BookOpen className="w-5 h-5" />
                                            Recommended Reading
                                        </h4>
                                        <div className="space-y-2">
                                            {syllabus.recommendedReadings.map((reading: string, index: number) => (
                                                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                                    <p className="text-sm font-medium text-gray-900">{reading}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {isLegacySyllabus(syllabus) && syllabus.toolsAndTechnologies && syllabus.toolsAndTechnologies.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                                            <Wrench className="w-5 h-5" />
                                            Tools & Technologies
                                        </h4>
                                        <div className="space-y-2">
                                            {syllabus.toolsAndTechnologies.map((tool: string, index: number) => (
                                                <div key={index} className="p-3 bg-purple-50 rounded-lg">
                                                    <p className="text-sm font-medium text-purple-900">{tool}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {(!isLegacySyllabus(syllabus) ||
                                    (!syllabus.recommendedReadings || syllabus.recommendedReadings.length === 0) &&
                                    (!syllabus.toolsAndTechnologies || syllabus.toolsAndTechnologies.length === 0)) && (
                                        <div className="text-center py-8">
                                            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                            <p className="text-gray-600">No additional resources defined for this course.</p>
                                        </div>
                                    )}
                            </TabsContent>
                        </div>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Topic Detail Modal */}
            {selectedTopic && (
                <TopicDetailModal
                    topic={selectedTopic}
                    isOpen={!!selectedTopic}
                    onClose={() => setSelectedTopic(null)}
                />
            )}
        </div>
    );
}