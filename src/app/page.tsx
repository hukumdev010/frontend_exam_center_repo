"use client";
// Hot reload test - this comment tests if hot reloading works

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
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
    setSearchLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.searchCertifications}?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to search certifications');
      }
      const data: SearchResponse = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setSearchLoading(false);
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
      <main className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Exam Center</h1>
              <div className="flex items-center gap-4">
                {session && (
                  <Link href="/profile">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
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
        <div className="max-w-6xl mx-auto p-6">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-slate-600">Loading certification categories...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error && !categories.length) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Exam Center</h1>
              <div className="flex items-center gap-4">
                {session && (
                  <Link href="/profile">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
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
        <div className="max-w-6xl mx-auto p-6">
          <div className="text-center">
            <p className="text-red-600">Error: {error}</p>
            <Button onClick={fetchCategories} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Award className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {session ? `Welcome back, ${session.user?.name?.split(' ')[0]}!` : 'Certification Center'}
                </h1>
                {session && (
                  <p className="text-sm text-slate-600">Search for certifications or browse by category</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {session && (
                <Link href="/profile">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
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

      <div className="max-w-6xl mx-auto p-6">
        {/* Show progress section only for authenticated users */}
        {session && (
          <div className="mb-8">
            <ProgressDashboard
              onContinueQuiz={handleCertificationSelect}
            />
          </div>
        )}

        {/* Search Section */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Find Your Certification</h2>
            <p className="text-lg text-slate-600">
              Search for specific certifications or browse by category
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <SearchBar
              onSearch={handleSearch}
              onClear={handleClearSearch}
              placeholder="Search certifications (e.g., AWS, Python, Security)..."
            />
          </div>

          {searchLoading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-slate-600">Searching...</p>
            </div>
          )}

          {error && searchResults && (
            <div className="text-center py-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Search Results or Category Browser */}
        {searchResults ? (
          <SearchResults
            results={searchResults.results}
            total={searchResults.total}
            query={searchResults.query}
            onCertificationSelect={handleCertificationSelect}
          />
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Browse by Category</h3>
              <p className="text-slate-600 mb-8">
                Explore our comprehensive collection of certification practice exams
              </p>
            </div>

            <CategoryScroller categories={categories} />
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-slate-500 text-sm">
            Practice exams are designed to help you prepare for real certifications.
            Questions are based on actual exam topics and scenarios.
          </p>
        </div>
      </div>
    </main>
  );
}
