import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header handles its own visibility based on pathname */}
            <Header />

            {/* Main content wrapper with consistent structure */}
            <main className="flex-1">
                {/* Pages handle their own background control */}
                {children}
            </main>

            {/* Footer handles its own visibility based on pathname */}
            <Footer />
        </div>
    );
}