"use client";

import { CategoryBrowser } from "@/components/CategoryBrowser";

export default function DashboardCategoriesPage() {
    return (
        <div className="p-4 lg:p-6">
            <CategoryBrowser
                showSearch={true}
            />
        </div>
    );
}