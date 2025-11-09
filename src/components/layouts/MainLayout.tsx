"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const pathname = usePathname();

    // Don't show header for dashboard pages and quiz pages (they have their own layout logic)
    const isDashboard = pathname?.startsWith('/dashboard');
    const isQuizPage = pathname?.startsWith('/quiz/');
    const isSyllabusPage = pathname?.startsWith('/syllabus/');

    // Determine header configuration based on route
    const getHeaderConfig = () => {
        if (!pathname) return {};

        if (pathname === '/') {
            return {
                pageTitle: "EduNeps - Learn & Teach",
                pageDescription: "Master certifications with personalized learning paths and expert tutoring"
            };
        }

        if (pathname.startsWith('/login')) {
            return {
                pageTitle: "Welcome to EduNeps",
                pageDescription: "Sign in to access your learning dashboard and track your progress"
            };
        }

        if (pathname.startsWith('/category/')) {
            // Extract category name from slug if possible
            const categorySlug = pathname.split('/')[2];
            const categoryName = categorySlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            return {
                pageTitle: categoryName ? `${categoryName} Certifications` : "Browse Categories",
                pageDescription: "Explore certification categories and start your learning journey"
            };
        }

        if (pathname.startsWith('/auth/')) {
            return {
                pageTitle: "Authentication",
                pageDescription: "Completing your sign-in process..."
            };
        }

        // Default for other pages
        return {};
    };

    const headerConfig = getHeaderConfig();

    // Check if this is a page that needs full control over its background
    const needsFullControl = pathname === '/' || pathname?.startsWith('/login');

    return (
        <div className="min-h-screen flex flex-col">
            {/* Only show header for non-dashboard and non-quiz pages */}
            {!isDashboard && !isQuizPage && <Header {...headerConfig} />}

            {/* Main content wrapper with consistent structure */}
            <main className="flex-1">
                {needsFullControl ? (
                    // Pages with special backgrounds get full control
                    children
                ) : (
                    // Other pages get the constrained width wrapper
                    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                        {children}
                    </div>
                )}
            </main>

            {/* Show footer for non-dashboard and non-syllabus pages */}
            {!isDashboard && !isSyllabusPage && <Footer />}
        </div>
    );
}