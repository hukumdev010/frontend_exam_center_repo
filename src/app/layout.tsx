import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import MainLayout from "@/components/layouts/MainLayout";
import HydrationBoundary from "@/components/HydrationBoundary";
import SimpleHydrationProtection from "@/components/SimpleHydrationProtection";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduNeps - Learning Platform",
  description: "Master your certifications with EduNeps comprehensive learning platform",
  icons: {
    icon: [
      {
        url: '/favicon-16x16.svg',
        sizes: '16x16',
        type: 'image/svg+xml',
      },
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      }
    ],
    shortcut: '/favicon-16x16.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SimpleHydrationProtection />
        <HydrationBoundary>
          <Providers>
            <MainLayout>
              {children}
            </MainLayout>
          </Providers>
        </HydrationBoundary>
      </body>
    </html>
  );
}
