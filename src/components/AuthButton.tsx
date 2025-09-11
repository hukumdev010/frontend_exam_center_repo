"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useAuth } from "@/lib/useAuth"

export function AuthButtonCore() {
    const { user, isAuthenticated, isLoading, signIn, signOut } = useAuth()

    if (isLoading) {
        return (
            <div className="flex items-center gap-2">
                <div className="h-10 w-24 bg-blue-100 animate-pulse rounded-xl flex items-center justify-center">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                </div>
            </div>
        )
    }

    if (isAuthenticated) {
        return (
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                            {user?.name?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <span className="font-medium text-slate-700 hidden sm:block">
                        {user?.name}
                    </span>
                </div>
                <Button
                    onClick={() => signOut()}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600"
                >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:block">Sign out</span>
                </Button>
            </div>
        )
    }

    return (
        <Button
            onClick={() => signIn()}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                     text-white font-medium px-6 py-2 rounded-xl shadow-lg hover:shadow-xl 
                     transition-all duration-200 hover-lift"
        >
            Sign in with Google
        </Button>
    )
}
