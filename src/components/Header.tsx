import React, { useEffect, useState } from 'react'
import { Award, User, ChevronDown, Home, CheckCircle, Target } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface HeaderProps {
    pageTitle?: string
    pageDescription?: string
    showQuizStats?: boolean
    quizStats?: {
        correct: number
        total: number
        currentQuestion: number
        totalQuestions: number
        score?: number
    }
    customContent?: React.ReactNode
}

const Header: React.FC<HeaderProps> = ({
    pageTitle,
    pageDescription,
    showQuizStats = false,
    quizStats,
    customContent
}) => {
    const { user, isAuthenticated } = useAuth()
    const [mounted, setMounted] = useState(false)
    const router = useRouter()

    useEffect(() => {
        // Use a timeout to avoid calling setState during render
        const timer = setTimeout(() => setMounted(true), 0)
        return () => clearTimeout(timer)
    }, [])

    const handleLogoClick = () => {
        router.push('/')
    }

    // Prevent hydration mismatch by showing consistent content during SSR
    if (!mounted) {
        return (
            <div className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
                <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center">
                        {/* Logo - fixed position on the left */}
                        <div className="flex-shrink-0">
                            <button
                                className="flex items-center hover:opacity-80 transition-opacity duration-200"
                            >
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-1.5 rounded-lg mr-3 shadow-md">
                                    <Award className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-left">
                                    <h1 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent leading-tight">
                                        EduNeps
                                    </h1>
                                    <p className="text-xs text-blue-600/60 font-normal leading-tight">
                                        Learning Platform
                                    </p>
                                </div>
                            </button>
                        </div>

                        {/* Center content - takes remaining space */}
                        <div className="flex-1 flex justify-center items-center">
                        </div>

                        {/* Right side - fixed position */}
                        <div className="flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-24 bg-gray-200 animate-pulse rounded-md"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex items-center">
                    {/* Logo - fixed position on the left */}
                    <div className="flex-shrink-0">
                        <button
                            onClick={handleLogoClick}
                            className="flex items-center hover:opacity-80 transition-opacity duration-200"
                        >
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-1.5 rounded-lg mr-3 shadow-md">
                                <Award className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left">
                                <h1 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent leading-tight">
                                    EduNeps
                                </h1>
                                <p className="text-xs text-blue-600/60 font-normal leading-tight">
                                    Learning Platform
                                </p>
                            </div>
                        </button>
                    </div>

                    {/* Center content - takes remaining space */}
                    <div className="flex-1 flex justify-center items-center">
                        {pageTitle && (
                            <div className="text-center">
                                <h2 className="text-sm font-medium text-gray-900">{pageTitle}</h2>
                                {pageDescription && (
                                    <p className="text-xs text-gray-600">{pageDescription}</p>
                                )}
                            </div>
                        )}

                        {showQuizStats && quizStats && (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span className="text-sm font-medium text-green-800">
                                        {quizStats.correct}/{quizStats.total} Correct
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
                                    <Target className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-800">
                                        Question {quizStats.currentQuestion}/{quizStats.totalQuestions}
                                    </span>
                                </div>
                                {quizStats.score !== undefined && (
                                    <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-full">
                                        <Award className="w-4 h-4 text-purple-600" />
                                        <span className="text-sm font-medium text-purple-800">
                                            Score: {quizStats.score}%
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {customContent && (
                            <div>
                                {customContent}
                            </div>
                        )}
                    </div>

                    {/* Right side - fixed position */}
                    <div className="flex-shrink-0">
                        {mounted && isAuthenticated ? (
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-3 flex items-center gap-2 border-gray-200 hover:bg-gray-50 text-gray-700 transition-all duration-200 hover:shadow-sm data-[state=open]:bg-gray-50 data-[state=open]:border-gray-300 text-sm"
                                    >
                                        <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                            <span className="text-white font-medium text-xs">
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="font-medium text-sm">{user?.name?.split(' ')[0]}</span>
                                        <ChevronDown className="w-3 h-3" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    side="bottom"
                                    sideOffset={6}
                                    alignOffset={0}
                                    avoidCollisions={true}
                                    className="w-40 z-50 origin-top-right border rounded-lg bg-white shadow-lg p-1"
                                    style={{
                                        animation: 'none !important',
                                        transform: 'none !important',
                                        transition: 'none !important'
                                    }}
                                >
                                    <DropdownMenuItem asChild>
                                        <Link href="/" className="flex items-center gap-2 text-sm py-2 px-2 hover:bg-gray-50 rounded-md">
                                            <Home className="w-3.5 h-3.5" />
                                            Home
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard" className="flex items-center gap-2 text-sm py-2 px-2 hover:bg-gray-50 rounded-md">
                                            <Award className="w-3.5 h-3.5" />
                                            Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile" className="flex items-center gap-2 text-sm py-2 px-2 hover:bg-gray-50 rounded-md">
                                            <User className="w-3.5 h-3.5" />
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => {
                                            localStorage.removeItem('access_token');
                                            localStorage.removeItem('user');
                                            window.location.href = '/';
                                        }}
                                        className="flex items-center gap-2 text-sm py-2 px-2 hover:bg-red-50 rounded-md text-red-600 cursor-pointer"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Sign Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : mounted ? (
                            <div className="flex items-center gap-2">
                                <Link href="/login?form=true">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-3 border-gray-200 hover:bg-gray-50 text-gray-700 text-sm"
                                    >
                                        Sign In
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-24 bg-gray-200 animate-pulse rounded-md"></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header