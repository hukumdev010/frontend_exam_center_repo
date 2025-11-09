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
    Wrench
} from "lucide-react";
import { SyllabusResponse, SyllabusData, isLegacySyllabus, isStructuredSyllabus } from "@/types/syllabus";

interface SyllabusViewerProps {
    syllabusData: SyllabusResponse;
    onClose: () => void;
}

export function SyllabusViewer({ syllabusData, onClose }: SyllabusViewerProps) {
    const [activeTab, setActiveTab] = useState("overview");
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
                                    {isLegacySyllabus(syllabus) ? (
                                        <>
                                            <h3 className="text-xl font-bold mb-4">{syllabus.courseOverview.title}</h3>
                                            <p className="text-gray-700 mb-4">{syllabus.courseOverview.description}</p>
                                        </>
                                    ) : (
                                        <>
                                            <h3 className="text-xl font-bold mb-4">Course Overview</h3>
                                            <p className="text-gray-700 mb-4">Structured syllabus content</p>
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
                                            {isLegacySyllabus(syllabus) && syllabus.courseOverview.prerequisites.map((prereq: string, index: number) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                    <span className="text-sm text-gray-700">{prereq}</span>
                                                </div>
                                            ))}
                                            {isStructuredSyllabus(syllabus) && (
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                    <span className="text-sm text-gray-700">Basic understanding of the subject</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="modules" className="mt-0 space-y-4">
                                {syllabus.modules.map((module, index) => (
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
                                                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                                                {typeof topic === 'string' ? topic :
                                                                    typeof topic === 'object' && 'title' in topic ? topic.title :
                                                                        'Untitled Topic'}
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
                                                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                                {objective}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
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
        </div>
    );
}