"use client"

import { useEffect, useState } from "react"
import { AuthButtonCore } from "./AuthButton"

export function AuthButton() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        // Render loading state during SSR and initial client render
        return (
            <div className="flex items-center gap-2">
                <div className="h-10 w-24 bg-blue-100 animate-pulse rounded-xl flex items-center justify-center">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                </div>
            </div>
        )
    }

    return <AuthButtonCore />
}
