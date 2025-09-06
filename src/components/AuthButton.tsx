"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useAuth } from "@/lib/useAuth"

export function AuthButtonCore() {
    const { user, isAuthenticated, isLoading, signIn, signOut } = useAuth()

    if (isLoading) {
        return (
            <div className="flex items-center gap-2">
                <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-md flex items-center justify-center">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
            </div>
        )
    }

    if (isAuthenticated) {
        return (
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                        {user?.name}
                    </span>
                </div>
                <Button
                    onClick={() => signOut()}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                >
                    <LogOut className="w-4 h-4" />
                    Sign out
                </Button>
            </div>
        )
    }

    return (
        <Button
            onClick={() => signIn()}
            className="bg-blue-600 hover:bg-blue-700"
        >
            Sign in with Google
        </Button>
    )
}
