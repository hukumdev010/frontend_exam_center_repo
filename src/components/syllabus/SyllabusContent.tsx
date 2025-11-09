"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SyllabusResponse, SyllabusTopic } from "@/types/syllabus";
import { MarkdownRenderer } from "./MarkdownRenderer";
import {
    BookOpen,
    Clock,
    Target,
    Lightbulb,
    GraduationCap,
    CheckCircle,
    Play,
    ExternalLink,
    User
} from "lucide-react";

interface SyllabusContentProps {
    selectedTopic: SyllabusTopic;
    syllabusData: SyllabusResponse;
}

// Helper function to convert detailed content JSON to markdown
function convertDetailedContentToMarkdown(detailedContent: unknown): string {
    if (!detailedContent) return '';

    const formatValue = (value: unknown, depth = 0): string => {
        if (typeof value === 'string') {
            return value;
        }

        if (Array.isArray(value)) {
            return value.map((item, index) => {
                if (typeof item === 'string') {
                    return `${index + 1}. ${item}`;
                } else if (typeof item === 'object') {
                    return formatValue(item, depth + 1);
                }
                return String(item);
            }).join('\n\n');
        }

        if (typeof value === 'object' && value !== null) {
            return Object.entries(value).map(([key, val]) => {
                const title = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                const prefix = '#'.repeat(Math.min(depth + 2, 6));
                return `${prefix} ${title}\n\n${formatValue(val, depth + 1)}`;
            }).join('\n\n');
        }

        return String(value);
    };

    let markdown = '';

    // Safely handle the content object
    const contentObj = detailedContent as Record<string, unknown>;

    // Add title if present
    if (contentObj.title && typeof contentObj.title === 'string') {
        markdown += `# ${contentObj.title}\n\n`;
    }

    // Add overview if present
    if (contentObj.overview && typeof contentObj.overview === 'string') {
        markdown += `## Overview\n\n${contentObj.overview}\n\n`;
    }

    // Process all other content
    Object.entries(contentObj).forEach(([key, value]) => {
        if (key === 'title' || key === 'overview') return; // Skip already processed

        const title = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        markdown += `## ${title}\n\n${formatValue(value, 1)}\n\n`;
    });

    return markdown;
}

export function SyllabusContent({ selectedTopic, syllabusData }: SyllabusContentProps) {
    if (!selectedTopic) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-lg">
                    <BookOpen className="w-20 h-20 mx-auto mb-6 text-blue-400" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                        Welcome to Your Learning Journey
                    </h3>
                    <p className="text-gray-600 mb-6 text-lg">
                        Select a topic from the sidebar to dive into detailed content, learning objectives, and comprehensive guidance.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-left shadow-sm">
                        <h4 className="font-semibold text-blue-900 mb-4 text-lg">Course Overview</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-blue-800">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-medium">{syllabusData.certification_name}</div>
                                    <div className="text-sm text-blue-600">Certification Program</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-blue-800">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <Target className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-medium">{syllabusData.certification_level}</div>
                                    <div className="text-sm text-blue-600">Difficulty Level</div>
                                </div>
                            </div>
                            {syllabusData.category && (
                                <div className="flex items-center gap-3 text-blue-800">
                                    <div className="bg-blue-100 p-2 rounded-lg">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-medium">{syllabusData.category.name}</div>
                                        <div className="text-sm text-blue-600">Category</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const getVideoStatusColor = (status?: string) => {
        switch (status) {
            case 'published': return 'default';
            case 'recorded': return 'secondary';
            case 'scripted': return 'outline';
            case 'planned': return 'destructive';
            default: return 'destructive';
        }
    };

    const getVideoStatusText = (status?: string) => {
        switch (status) {
            case 'published': return 'Video Available';
            case 'recorded': return 'Video Recorded';
            case 'scripted': return 'Script Ready';
            case 'planned': return 'In Planning';
            default: return 'Not Started';
        }
    };

    return (
        <div className="min-h-full">
            {/* Topic Header with enhanced styling */}
            <div className="mb-8 pb-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                            {selectedTopic.title}
                        </h1>
                        <div className="flex items-center gap-6 text-gray-600">
                            {selectedTopic.estimatedDuration && (
                                <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm font-medium">{selectedTopic.estimatedDuration}</span>
                                </div>
                            )}
                            {selectedTopic.videoStatus && (
                                <Badge variant={getVideoStatusColor(selectedTopic.videoStatus)} className="px-3 py-1">
                                    {getVideoStatusText(selectedTopic.videoStatus)}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                {/* Topic Introduction - Only show if no detailed content available */}
                {selectedTopic.introduction && !selectedTopic.detailed_content?.detailed_content?.introduction && (
                    <Card className="mb-8 border-l-4 border-l-blue-500 shadow-lg">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-3 text-xl">
                                <BookOpen className="w-6 h-6 text-blue-600" />
                                Introduction
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 leading-relaxed text-lg">
                                {selectedTopic.introduction}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Quick Summary - Show basic intro as summary when detailed content exists */}
                {selectedTopic.introduction && selectedTopic.detailed_content?.detailed_content?.introduction && (
                    <Card className="mb-8 border-l-4 border-l-green-500 bg-green-50 shadow-lg">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-3 text-xl text-green-800">
                                <Target className="w-6 h-6" />
                                Quick Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-green-800 leading-relaxed text-lg">
                                {selectedTopic.introduction}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Video Section */}
                {selectedTopic.videoUrl && (
                    <Card className="mb-8 border-l-4 border-l-green-500 bg-green-50 shadow-lg">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-3 text-xl text-green-800">
                                <Play className="w-6 h-6" />
                                Video Content Available
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-green-800 mb-4 text-lg">
                                This topic has video content available for learning.
                            </p>
                            <Button
                                onClick={() => window.open(selectedTopic.videoUrl, '_blank')}
                                className="bg-green-600 hover:bg-green-700 px-6 py-3"
                                size="lg"
                            >
                                <Play className="w-5 h-5 mr-2" />
                                Watch Video
                                <ExternalLink className="w-5 h-5 ml-2" />
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Content Sections with improved spacing */}
            <div className="space-y-8">
                {/* Detailed Content from Python files - Show complete JSON as markdown */}
                {selectedTopic.detailed_content && (
                    <Card className="border-l-4 border-l-blue-500 shadow-lg">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-3 text-2xl">
                                <BookOpen className="w-6 h-6 text-blue-600" />
                                {selectedTopic.detailed_content.title || selectedTopic.title}
                            </CardTitle>
                            {selectedTopic.detailed_content.duration && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Clock className="w-4 h-4" />
                                    <span>{selectedTopic.detailed_content.duration}</span>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="prose max-w-none">
                            <MarkdownRenderer content={convertDetailedContentToMarkdown(selectedTopic.detailed_content)} />
                        </CardContent>
                    </Card>
                )}



                {/* Basic Content Sections - Show only if no detailed content or as supplements */}
                {/* Key Points */}
                {selectedTopic.content?.key_points && (
                    <Card className="border-l-4 border-l-purple-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Target className="w-5 h-5 text-purple-600" />
                                Key Learning Points
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {selectedTopic.content.key_points.map((point, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span className="text-gray-700 leading-relaxed">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                {/* Practical Examples */}
                {selectedTopic.content?.practical_examples && (
                    <Card className="border-l-4 border-l-orange-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Lightbulb className="w-5 h-5 text-orange-600" />
                                Practical Examples
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {selectedTopic.content.practical_examples.map((example, index) => (
                                    <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-orange-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0">
                                                {index + 1}
                                            </div>
                                            <p className="text-gray-800 leading-relaxed">{example}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Teaching Guide */}
                {selectedTopic.content?.what_to_teach && syllabusData.is_qualified_teacher && (
                    <Card className="border-l-4 border-l-yellow-500 bg-yellow-50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl text-yellow-800">
                                <GraduationCap className="w-5 h-5" />
                                Video Creation Guide
                                <Badge variant="secondary" className="ml-2 text-xs">Teacher Only</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-yellow-800 mb-4 font-medium">
                                Use this step-by-step guide to create engaging YouTube videos:
                            </p>
                            <ol className="space-y-3">
                                {selectedTopic.content.what_to_teach.map((guide, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="bg-yellow-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                                            {index + 1}
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-yellow-900 leading-relaxed">{guide}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </CardContent>
                    </Card>
                )}

                {/* Topic Description */}
                {selectedTopic.description && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <BookOpen className="w-5 h-5 text-gray-600" />
                                Topic Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 leading-relaxed">
                                {selectedTopic.description}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Empty State */}
            {!selectedTopic.introduction &&
                !selectedTopic.content?.key_points &&
                !selectedTopic.content?.practical_examples &&
                !selectedTopic.content?.what_to_teach &&
                !selectedTopic.description &&
                !selectedTopic.detailed_content && (
                    <Card className="text-center py-12">
                        <CardContent>
                            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <h3 className="text-lg font-medium text-gray-600 mb-2">
                                Content Coming Soon
                            </h3>
                            <p className="text-gray-500">
                                Detailed content for this topic is being prepared and will be available soon.
                            </p>
                        </CardContent>
                    </Card>
                )}


        </div>
    );
}