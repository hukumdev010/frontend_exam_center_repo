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
                <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-md flex items-center justify-center">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
            </div>
        )
    }

    return <AuthButtonCore />
}
