"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Award,
    Download,
    Trophy,
    Calendar,
    BookOpen,
    CheckCircle,
    FileText
} from "lucide-react";
import { useMyCertificates, useDownloadCertificate } from "@/hooks/useApi";

interface Certificate {
    id: string;
    user_id: string;
    quiz_attempt_id: string;
    certification_id: number;
    certification_name: string;
    category_name: string;
    user_name?: string;
    user_email: string;
    score: number;
    total_questions: number;
    issued_at: string;
    pdf_filename?: string;
}



export default function CertificatesPage() {
    const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());

    // Use SWR hooks
    const { data: certificatesData = [], isLoading: loading, error } = useMyCertificates();
    const certificates = Array.isArray(certificatesData) ? certificatesData as Certificate[] : [];
    const { trigger: downloadCertificate } = useDownloadCertificate();

    const handleDownload = async (certificate: Certificate) => {
        try {
            setDownloadingIds(prev => new Set(prev).add(certificate.id));
            const blob = await downloadCertificate(certificate.id);

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${certificate.certification_name.replace(/[^a-zA-Z0-9]/g, "_")}_Certificate.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading certificate:", error);
            // You might want to show a toast notification here
        } finally {
            setDownloadingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(certificate.id);
                return newSet;
            });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    const getScoreColor = (score: number) => {
        if (score >= 95) return "text-green-600";
        if (score >= 90) return "text-blue-600";
        if (score >= 80) return "text-orange-600";
        return "text-gray-600";
    };

    const getScoreBadgeVariant = (score: number) => {
        if (score >= 95) return "default";
        if (score >= 90) return "secondary";
        return "outline";
    };

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="text-red-600">Error loading certificates. Please try refreshing the page.</div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Certificates</CardTitle>
                        <Award className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{certificates.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Certificates earned
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                        <Trophy className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {certificates.length > 0
                                ? Math.round(certificates.reduce((sum, cert) => sum + cert.score, 0) / certificates.length)
                                : 0
                            }%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Across all certificates
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Excellence Rate</CardTitle>
                        <CheckCircle className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {certificates.length > 0
                                ? Math.round((certificates.filter(cert => cert.score >= 90).length / certificates.length) * 100)
                                : 0
                            }%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            90% or above scores
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Certificates List */}
            {certificates.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <FileText className="h-16 w-16 text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Certificates Yet</h3>
                        <p className="text-gray-600 text-center mb-6 max-w-md">
                            Complete quizzes with a score of 80% or higher to earn certificates.
                            Certificates are automatically generated upon successful completion.
                        </p>
                        <Button
                            onClick={() => window.location.href = "/dashboard/categories"}
                            className="inline-flex items-center gap-2"
                        >
                            <BookOpen className="w-4 h-4" />
                            Browse Certifications
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {certificates.map((certificate) => (
                        <Card key={certificate.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg mb-2">
                                            {certificate.certification_name}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-2 mb-2">
                                            <BookOpen className="w-4 h-4" />
                                            {certificate.category_name}
                                        </CardDescription>
                                    </div>
                                    <Badge
                                        variant={getScoreBadgeVariant(certificate.score)}
                                        className="ml-2"
                                    >
                                        <Trophy className="w-3 h-3 mr-1" />
                                        {certificate.score}%
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Score:</span>
                                        <span className={`font-semibold ${getScoreColor(certificate.score)}`}>
                                            {certificate.score}% ({Math.round(certificate.score * certificate.total_questions / 100)} / {certificate.total_questions})
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Issued:</span>
                                        <div className="flex items-center gap-1 text-gray-900">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(certificate.issued_at)}
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => handleDownload(certificate)}
                                        disabled={downloadingIds.has(certificate.id)}
                                        className="w-full mt-4"
                                        variant="outline"
                                    >
                                        {downloadingIds.has(certificate.id) ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                                                Downloading...
                                            </>
                                        ) : (
                                            <>
                                                <Download className="w-4 h-4 mr-2" />
                                                Download Certificate
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}