"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useAuth } from "@/lib/useAuth"

export function AuthButtonCore() {
    const { isAuthenticated, isLoading, signIn, signOut } = useAuth()

    if (isLoading) {
        return (
            <div className="flex items-center gap-2">
                <div className="h-8 w-20 bg-gray-100 animate-pulse rounded-md flex items-center justify-center">
                    <div className="inline-block animate-spin rounded-full h-3 w-3 border-2 border-blue-600 border-t-transparent"></div>
                </div>
            </div>
        )
    }

    if (isAuthenticated) {
        return (
            <div className="flex items-center gap-2">
                <Button
                    onClick={() => signOut()}
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 flex items-center gap-1.5 border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 text-sm"
                >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:block text-sm">Sign out</span>
                </Button>
            </div>
        )
    }

    return (
        <Button
            onClick={() => signIn()}
            size="sm"
            className="h-8 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                     text-white font-medium rounded-lg shadow-md hover:shadow-lg 
                     transition-all duration-200 text-sm"
        >
            Sign in with Google
        </Button>
    )
}
