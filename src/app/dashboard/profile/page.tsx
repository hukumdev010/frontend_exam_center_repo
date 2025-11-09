"use client";

import { useSession } from "@/lib/useAuth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import {
    ApprovalStatusCard,
    BasicInformationCard,
    QualificationsCard,
    ExperienceCard,
    OnlinePresenceCard,
    CertificationsCard,
    ProfileActions
} from "./components";



interface TeacherProfile {
    id?: number;
    bio: string;
    qualifications: string;
    experience: string;
    github_url: string;
    linkedin_url: string;
    website_url: string;
    certifications_earned: string[];
    approval_status: 'pending' | 'approved' | 'rejected' | null;
    admin_notes: string;
}

export default function DashboardProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [profile, setProfile] = useState<TeacherProfile>({
        bio: '',
        qualifications: '',
        experience: '',
        github_url: '',
        linkedin_url: '',
        website_url: '',
        certifications_earned: [],
        approval_status: null,
        admin_notes: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        if (status !== 'loading' && status === 'unauthenticated') {
            router.push("/login");
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user?.id) {
            loadProfile();
        } else {
            setLoading(false);
        }
    }, [session?.user?.id]);

    const loadProfile = async () => {
        try {
            // TODO: Implement API call to load teacher profile
            // For now, we'll use dummy data
            setProfile({
                bio: '',
                qualifications: '',
                experience: '',
                github_url: '',
                linkedin_url: '',
                website_url: '',
                certifications_earned: [],
                approval_status: null,
                admin_notes: ''
            });
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // TODO: Implement API call to save teacher profile
            console.log('Saving profile:', profile);
            setEditing(false);
        } catch (error) {
            console.error('Error saving profile:', error);
        } finally {
            setSaving(false);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="flex h-screen bg-gray-50">
                <div className="flex-1 flex flex-col lg:ml-64">
                    <div className="flex-1 overflow-y-auto p-4 lg:p-6">
                        <div className="max-w-4xl mx-auto">
                            <div className="animate-pulse space-y-6">
                                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                                <div className="space-y-4">
                                    <div className="h-64 bg-gray-200 rounded-lg"></div>
                                    <div className="h-32 bg-gray-200 rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="p-4 lg:p-6">
            <div className="mb-6">
                <Link href="/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Dashboard
                </Link>
                <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
                <p className="text-sm text-gray-600">Manage your profile and teacher application</p>
            </div>
            <div className="max-w-4xl mx-auto">
                {/* Approval Status */}
                <ApprovalStatusCard
                    approval_status={profile.approval_status}
                    admin_notes={profile.admin_notes}
                />

                <div className="space-y-6">
                    {/* Basic Information */}
                    <BasicInformationCard
                        bio={profile.bio}
                        onBioChange={(bio) => setProfile({ ...profile, bio })}
                        editing={editing}
                    />

                    {/* Qualifications */}
                    <QualificationsCard
                        qualifications={profile.qualifications}
                        onQualificationsChange={(qualifications) => setProfile({ ...profile, qualifications })}
                        editing={editing}
                    />

                    {/* Professional Experience */}
                    <ExperienceCard
                        experience={profile.experience}
                        onExperienceChange={(experience) => setProfile({ ...profile, experience })}
                        editing={editing}
                    />

                    {/* Online Presence */}
                    <OnlinePresenceCard
                        github_url={profile.github_url}
                        linkedin_url={profile.linkedin_url}
                        website_url={profile.website_url}
                        onGithubChange={(github_url) => setProfile({ ...profile, github_url })}
                        onLinkedinChange={(linkedin_url) => setProfile({ ...profile, linkedin_url })}
                        onWebsiteChange={(website_url) => setProfile({ ...profile, website_url })}
                        editing={editing}
                    />

                    {/* Platform Certifications */}
                    <CertificationsCard
                        certifications_earned={profile.certifications_earned}
                    />

                    {/* Action Buttons */}
                    <ProfileActions
                        editing={editing}
                        saving={saving}
                        onEdit={() => setEditing(true)}
                        onSave={handleSave}
                        onCancel={() => setEditing(false)}
                    />
                </div>
            </div>
        </div>
    );
}