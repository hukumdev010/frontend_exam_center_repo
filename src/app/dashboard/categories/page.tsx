"use client";

import { CategoryBrowser } from "@/components/CategoryBrowser";
import { Sidebar } from "@/components/ui/sidebar";

export default function DashboardCategoriesPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-slate-200 flex-shrink-0">
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-x-hidden">
                <div className="p-8">
                    <CategoryBrowser
                        title="Certification Categories"
                        subtitle="Explore all available certification categories and find the perfect exam for your career goals"
                        showSearch={true}
                    />
                </div>
            </div>
        </div>
    );
}