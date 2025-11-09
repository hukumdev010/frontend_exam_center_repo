"use client";

import { useState } from "react";
import { HeroSection, Sidebar, MainContent } from './components';
import type { FilterState } from './components/Sidebar';

export default function Home() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState<'certifications' | 'teachers'>('certifications');
  const [filters, setFilters] = useState<FilterState>({
    selectedCategories: [],
    selectedTeachers: [],
    searchQuery: ""
  });

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
      <HeroSection />

      {/* Main Layout with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            <Sidebar
              showSidebar={showSidebar}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onCloseSidebar={() => setShowSidebar(false)}
              onFiltersChange={setFilters}
            />

            <MainContent
              activeTab={activeTab}
              onShowSidebar={() => setShowSidebar(true)}
              filters={filters}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
