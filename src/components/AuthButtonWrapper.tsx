"use client"

import { useEffect, useState } from "react"
import { AuthButtonCore } from "./AuthButton"

export function AuthButton() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        // Use a timeout to avoid calling setState during render
        const timer = setTimeout(() => setMounted(true), 0)
        return () => clearTimeout(timer)
    }, [])

    if (!mounted) {
        return (
            <button
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                         text-white font-medium px-6 py-2 rounded-xl shadow-lg hover:shadow-xl 
                         transition-all duration-200 hover-lift"
                disabled
            >
                Sign in with Google
            </button>
        )
    }

    return <AuthButtonCore />
}
