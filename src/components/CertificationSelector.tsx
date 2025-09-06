"use client";

import { Button } from "./ui/button";
import { BookOpen, ArrowRight, Award } from "lucide-react";

type Certification = {
    id: string;
    name: string;
    description: string;
    questionsCount: number;
    level: "Associate" | "Professional" | "Specialty";
    duration: number; // in minutes
};

interface CertificationSelectorProps {
    onCertificationSelect: (certificationId: string) => void;
}

export function CertificationSelector({ onCertificationSelect }: CertificationSelectorProps) {
    const certifications: Certification[] = [
        {
            id: "solutions-architect-associate",
            name: "AWS Certified Solutions Architect – Associate",
            description: "Validate your ability to design and deploy scalable, highly available, and fault-tolerant systems on AWS.",
            questionsCount: 65,
            level: "Associate",
            duration: 130
        },
        {
            id: "developer-associate",
            name: "AWS Certified Developer – Associate",
            description: "Demonstrate your expertise in developing and maintaining applications on the AWS platform.",
            questionsCount: 65,
            level: "Associate",
            duration: 130
        },
        {
            id: "sysops-administrator-associate",
            name: "AWS Certified SysOps Administrator – Associate",
            description: "Show your technical expertise in deployment, management, and operations on the AWS platform.",
            questionsCount: 65,
            level: "Associate",
            duration: 130
        },
        {
            id: "solutions-architect-professional",
            name: "AWS Certified Solutions Architect – Professional",
            description: "Validate advanced technical skills and experience in designing distributed applications and systems on the AWS platform.",
            questionsCount: 75,
            level: "Professional",
            duration: 180
        },
        {
            id: "devops-engineer-professional",
            name: "AWS Certified DevOps Engineer – Professional",
            description: "Demonstrate your technical expertise in provisioning, operating, and managing distributed application systems on the AWS platform.",
            questionsCount: 75,
            level: "Professional",
            duration: 180
        },
        {
            id: "security-specialty",
            name: "AWS Certified Security – Specialty",
            description: "Validate your expertise in creating and implementing security solutions in the AWS Cloud.",
            questionsCount: 65,
            level: "Specialty",
            duration: 170
        }
    ];

    const getLevelColor = (level: string) => {
        switch (level) {
            case "Associate":
                return "bg-blue-100 text-blue-800";
            case "Professional":
                return "bg-purple-100 text-purple-800";
            case "Specialty":
                return "bg-orange-100 text-orange-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <Award className="w-12 h-12 text-orange-600 mr-3" />
                        <h1 className="text-4xl font-bold text-slate-900">AWS Certification Center</h1>
                    </div>
                    <p className="text-xl text-slate-600">
                        Choose your AWS certification path and start practicing
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {certifications.map((cert) => (
                        <div
                            key={cert.id}
                            className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center">
                                    <BookOpen className="w-6 h-6 text-slate-600 mr-2" />
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(cert.level)}`}>
                                        {cert.level}
                                    </span>
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                {cert.name}
                            </h3>

                            <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                                {cert.description}
                            </p>

                            <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                                <span>{cert.questionsCount} Questions</span>
                                <span>{cert.duration} Minutes</span>
                            </div>

                            <Button
                                onClick={() => onCertificationSelect(cert.id)}
                                className="w-full inline-flex items-center justify-center gap-2"
                            >
                                Start Practice Exam
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-slate-500 text-sm">
                        Practice exams are designed to help you prepare for AWS certifications.
                        Questions are based on real exam topics and scenarios.
                    </p>
                </div>
            </div>
        </div>
    );
}
