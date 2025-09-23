"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/useAuth";
import ProgressDashboard from "@/components/ProgressDashboard";
import { AuthButton } from "@/components/AuthButtonWrapper";
import { CategoryBrowser } from "@/components/CategoryBrowser";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { User, Award, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCertificationSelect = async (slug: string) => {
    router.push(`/quiz/${slug}`);
  };

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
                {!mounted || !session && (
                  <p className="text-sm text-blue-600/70 font-medium">Search for certifications or browse by category</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2 border-blue-200 hover:bg-blue-50 text-blue-700 h-8">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{mounted && session ? session.user?.name?.split(' ')[0] : 'Account'}</span>
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {mounted && session ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <div className="w-full">
                          <AuthButton />
                        </div>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem asChild>
                      <div className="w-full">
                        <AuthButton />
                      </div>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
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

          <CategoryBrowser
            title="Find Your Certification"
            subtitle="Search for specific certifications or browse by category to advance your career"
            showSearch={true}
          />
        </div>
      </div>
    </main>
  );
}
