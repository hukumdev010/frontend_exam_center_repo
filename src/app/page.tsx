"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/useAuth";
import ProgressDashboard from "@/components/ProgressDashboard";
import { CategoryBrowser } from "@/components/CategoryBrowser";
import TeacherList from "@/components/TeacherList";
import Header from './header';

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
      <Header />

      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-sm rounded-t-3xl shadow-2xl border border-blue-100/50 mt-6">
        <div className="p-8">
          {mounted && session && (
            <div className="mb-8">
              <ProgressDashboard onContinueQuiz={handleCertificationSelect} />
            </div>
          )}

          <CategoryBrowser
            showSearch={true}
          />

          <div className="mt-12">
            <TeacherList />
          </div>
        </div>
      </div>
    </main>
  );
}
