"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    ChevronLeft,
    ChevronRight,
    Home,
    BookOpen,
    Award,
    Users,
    Calendar,
    BarChart3,
    User,
    GraduationCap,
    Menu,
    X
} from "lucide-react";
import { Button } from "./button";

interface SidebarItem {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
}

interface SidebarProps {
    userRole?: "student" | "teacher" | "admin";
    className?: string;
}

export function Sidebar({ userRole = "student", className }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();

    const studentItems: SidebarItem[] = [
        { title: "Dashboard", href: "/dashboard", icon: Home },
        { title: "Student Portal", href: "/dashboard/student", icon: BookOpen },
        { title: "Categories", href: "/dashboard/categories", icon: BookOpen },
        { title: "Quizzes", href: "/quiz", icon: Award },
        { title: "Sessions", href: "/sessions", icon: Calendar },
        { title: "Profile", href: "/profile", icon: User },
    ];

    const teacherAdditionalItems: SidebarItem[] = [
        { title: "Teaching Dashboard", href: "/dashboard/teacher", icon: GraduationCap },
        { title: "My Teaching Sessions", href: "/dashboard/teacher/sessions", icon: Calendar },
        { title: "My Students", href: "/dashboard/teacher/students", icon: Users },
        { title: "Teaching Analytics", href: "/dashboard/teacher/analytics", icon: BarChart3 },
    ];

    // Always include student items; add teacher items if user is a teacher
    const items = userRole === "teacher"
        ? [...studentItems, ...teacherAdditionalItems]
        : studentItems;

    const SidebarContent = () => (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className={cn(
                "flex items-center justify-between border-b px-3 py-4",
                collapsed ? "px-2" : "px-6"
            )}>
                <Link href="/" className={cn("flex items-center gap-2", collapsed && "justify-center")}>
                    <GraduationCap className="h-8 w-8 text-blue-600" />
                    {!collapsed && (
                        <span className="text-xl font-bold text-gray-900">ExamCenter</span>
                    )}
                </Link>
                <Button
                    variant="ghost"
                    size="sm"
                    className="hidden lg:flex"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden"
                    onClick={() => setMobileOpen(false)}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-2 py-4">
                {items.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== "/dashboard" && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-blue-100 text-blue-900"
                                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                                collapsed ? "justify-center" : "justify-start"
                            )}
                            onClick={() => setMobileOpen(false)}
                        >
                            <item.icon className={cn("h-5 w-5 flex-shrink-0", collapsed ? "" : "mr-3")} />
                            {!collapsed && (
                                <>
                                    <span className="truncate">{item.title}</span>
                                    {item.badge && (
                                        <span className="ml-auto rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                                            {item.badge}
                                        </span>
                                    )}
                                </>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="border-t p-4">
                <div className={cn(
                    "flex items-center gap-3 text-sm text-gray-600",
                    collapsed && "justify-center"
                )}>
                    <div className={cn(
                        "h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center relative",
                        userRole === "teacher" ? "bg-green-100" : "bg-blue-100"
                    )}>
                        <User className="h-4 w-4 text-blue-600" />
                        {userRole === "teacher" && (
                            <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-600 rounded-full flex items-center justify-center">
                                <GraduationCap className="h-2 w-2 text-white" />
                            </div>
                        )}
                    </div>
                    {!collapsed && (
                        <div>
                            <div className="font-medium">
                                {userRole === "teacher" ? "Student + Teacher" : "Student"}
                            </div>
                            <div className="text-xs text-gray-500">
                                {userRole === "teacher" ? "Learning & Teaching" : "Learning Mode"}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile menu button */}
            <Button
                variant="outline"
                size="sm"
                className="fixed top-4 left-4 z-50 lg:hidden"
                onClick={() => setMobileOpen(true)}
            >
                <Menu className="h-4 w-4" />
            </Button>

            {/* Desktop sidebar */}
            <div className={cn(
                "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200 lg:transition-all lg:duration-300",
                collapsed ? "lg:w-16" : "lg:w-64",
                className
            )}>
                <SidebarContent />
            </div>

            {/* Mobile sidebar */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:hidden",
                mobileOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <SidebarContent />
            </div>
        </>
    );
}