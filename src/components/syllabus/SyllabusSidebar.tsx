"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    SyllabusResponse,
    SyllabusTopic,
    isStructuredSyllabus
} from "@/types/syllabus";
import {
    BookOpen,
    ChevronDown,
    ChevronRight,
    Clock,
    Play,
    Target,
    Users
} from "lucide-react";

interface SyllabusSidebarProps {
    syllabusData: SyllabusResponse;
    selectedTopic: SyllabusTopic | null;
    onTopicSelect: (topic: SyllabusTopic) => void;
}

export function SyllabusSidebar({ syllabusData, selectedTopic, onTopicSelect }: SyllabusSidebarProps) {
    const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([1])); // First module expanded by default
    const syllabus = syllabusData.syllabus;

    if (!syllabus || !isStructuredSyllabus(syllabus)) {
        return (
            <div className="p-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5" />
                            Course Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 text-sm">
                            This syllabus uses legacy format. Please update to the new structured format for full navigation features.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const toggleModule = (moduleNumber: number) => {
        const newExpanded = new Set(expandedModules);
        if (newExpanded.has(moduleNumber)) {
            newExpanded.delete(moduleNumber);
        } else {
            newExpanded.add(moduleNumber);
        }
        setExpandedModules(newExpanded);
    };

    const getVideoStatusColor = (status?: string) => {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-800 border-green-200';
            case 'recorded': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'scripted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'planned': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-red-100 text-red-800 border-red-200';
        }
    };

    return (
        <div className="flex flex-col">
            {/* Course Summary */}
            <div className="p-4 border-b border-gray-200">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{syllabus.modules.length} Modules</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <BookOpen className="w-4 h-4" />
                        <span>
                            {syllabus.modules.reduce((total, module) => total + module.topics.length, 0)} Topics
                        </span>
                    </div>

                    {syllabusData.is_qualified_teacher && (
                        <Badge variant="secondary" className="text-xs">
                            Teacher Access
                        </Badge>
                    )}
                </div>
            </div>

            {/* Modules List */}
            <div className="flex-1">
                <div className="p-4 space-y-3">
                    {syllabus.modules.map((module) => (
                        <div key={module.id} className="border border-gray-200 rounded-lg">
                            {/* Module Header */}
                            <Button
                                variant="ghost"
                                className="w-full p-3 justify-between h-auto text-left hover:bg-gray-50"
                                onClick={() => toggleModule(module.moduleNumber)}
                            >
                                <div className="flex-1">
                                    <div className="font-medium text-gray-900">
                                        Module {module.moduleNumber}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        {module.title}
                                    </div>
                                    {module.duration && (
                                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                                            <Clock className="w-3 h-3" />
                                            {module.duration}
                                        </div>
                                    )}
                                </div>
                                <div className="ml-2">
                                    {expandedModules.has(module.moduleNumber) ? (
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                    )}
                                </div>
                            </Button>

                            {/* Topics List */}
                            {expandedModules.has(module.moduleNumber) && (
                                <div className="border-t border-gray-200">
                                    <div className="p-2 space-y-1">
                                        {module.topics.map((topic) => (
                                            <Button
                                                key={topic.id}
                                                variant={selectedTopic?.id === topic.id ? "secondary" : "ghost"}
                                                className="w-full p-2 justify-start h-auto text-left text-sm"
                                                onClick={() => onTopicSelect(topic)}
                                            >
                                                <div className="flex items-start gap-2 w-full">
                                                    <Play className="w-3 h-3 text-blue-600 mt-1 shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium text-gray-900 truncate">
                                                            {topic.title}
                                                        </div>

                                                        <div className="flex items-center justify-between mt-1">
                                                            {topic.estimatedDuration && (
                                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                                    <Clock className="w-3 h-3" />
                                                                    {topic.estimatedDuration}
                                                                </div>
                                                            )}

                                                            {topic.videoStatus && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className={`text-xs px-2 py-0 h-5 ${getVideoStatusColor(topic.videoStatus)}`}
                                                                >
                                                                    {topic.videoStatus}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Learning Objectives Summary */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Target className="w-4 h-4" />
                    Learning Progress
                </div>
                <div className="text-xs text-gray-600">
                    Track your progress through each module and topic as you learn.
                </div>
            </div>
        </div>
    );
}