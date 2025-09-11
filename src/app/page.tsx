"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/useAuth";
import { ProgressDashboard } from "@/components/ProgressDashboard";
import { AuthButton } from "@/components/AuthButtonWrapper";
import { SearchBar } from "@/components/SearchBar";
import { CategoryScroller } from "@/components/CategoryScroller";
import { SearchResults } from "@/components/SearchResults";
import { Button } from "@/components/ui/button";
import { User, Award } from "lucide-react";
import Link from "next/link";
import { API_ENDPOINTS } from "@/lib/api-config";

type Category = {
  id: number;
  name: string;
  description: string;
  slug: string;
  icon: string;
  color: string;
  certifications: Certification[];
};

type Certification = {
  id: number;
  name: string;
  description: string;
  slug: string;
  level: string;
  duration: number;
  questions_count: number;
};

type SearchResult = {
  id: number;
  name: string;
  description: string;
  slug: string;
  level: string;
  duration: number;
  questions_count: number;
  category: {
    id: number;
    name: string;
    description: string;
    slug: string;
    icon: string;
    color: string;
  } | null;
};

type SearchResponse = {
  results: SearchResult[];
  total: number;
  query: string;
};

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.categories);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    try {
      setError(null);
      const response = await fetch(`${API_ENDPOINTS.searchCertifications}?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    }
  };

  const handleClearSearch = () => {
    setSearchResults(null);
    setError(null);
  };

  const handleCertificationSelect = async (slug: string) => {
    router.push(`/quiz/${slug}`);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Award className="w-8 h-8 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Exam Center
                </h1>
              </div>
              <div className="flex items-center gap-4">
                {mounted && session && (
                  <Link href="/profile">
                    <Button variant="outline" size="sm" className="flex items-center gap-2 border-blue-200 hover:bg-blue-50">
                      <User className="w-4 h-4" />
                      Profile
                    </Button>
                  </Link>
                )}
                <AuthButton />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-sm rounded-t-3xl shadow-2xl border border-blue-100/50 mt-6">
          <div className="p-8">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
              <p className="mt-2 text-slate-600">Loading certification categories...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error && !categories.length) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Award className="w-8 h-8 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Exam Center
                </h1>
              </div>
              <div className="flex items-center gap-4">
                {mounted && session && (
                  <Link href="/profile">
                    <Button variant="outline" size="sm" className="flex items-center gap-2 border-blue-200 hover:bg-blue-50">
                      <User className="w-4 h-4" />
                      Profile
                    </Button>
                  </Link>
                )}
                <AuthButton />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-sm rounded-t-3xl shadow-2xl border border-blue-100/50 mt-6">
          <div className="p-8">
            <div className="text-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-600 mb-4">Error: {error}</p>
                <Button onClick={fetchCategories} className="bg-blue-600 hover:bg-blue-700">
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-xl mr-4 shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  {mounted && session ? `Welcome back, ${session.user?.name?.split(' ')[0]}!` : 'Certification Center'}
                </h1>
                {mounted && session && (
                  <p className="text-sm text-blue-600/70 font-medium">Search for certifications or browse by category</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {mounted && session && (
                <Link href="/profile">
                  <Button variant="outline" size="sm" className="flex items-center gap-2 border-blue-200 hover:bg-blue-50 text-blue-700">
                    <User className="w-4 h-4" />
                    Profile
                  </Button>
                </Link>
              )}
              <AuthButton />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-sm rounded-t-3xl shadow-2xl border border-blue-100/50 mt-6">
        <div className="p-8">
          {mounted && session && (
            <div className="mb-8">
              <ProgressDashboard onContinueQuiz={handleCertificationSelect} />
            </div>
          )}

          <div className="mb-12">
            <div className="text-center mb-8">
              <div className="inline-block">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
                  Find Your Certification
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto mb-4 rounded-full"></div>
              </div>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Search for specific certifications or browse by category to advance your career
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <SearchBar
                onSearch={handleSearch}
                onClear={handleClearSearch}
                placeholder="Search certifications (e.g., AWS, Azure, Google Cloud...)"
              />
            </div>

            {searchResults && (
              <div className="mt-8">
                <SearchResults
                  results={searchResults.results}
                  total={searchResults.total}
                  query={searchResults.query}
                  onCertificationSelect={handleCertificationSelect}
                />
              </div>
            )}

            {error && searchResults === null && (
              <div className="mt-8 max-w-2xl mx-auto">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-center">Error: {error}</p>
                </div>
              </div>
            )}
          </div>

          {!searchResults && (
            <div>
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
                  Browse by Category
                </h3>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto mb-4 rounded-full"></div>
                <p className="text-lg text-slate-600">
                  Explore our comprehensive collection of certification exams
                </p>
              </div>

              <CategoryScroller categories={categories} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
