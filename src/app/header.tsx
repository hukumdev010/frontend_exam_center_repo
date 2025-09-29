import React, { useEffect, useState } from 'react'
import { Award, User, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/useAuth'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { AuthButtonCore } from '@/components/AuthButton'

const Header = () => {
    const { user, isAuthenticated } = useAuth()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Prevent hydration mismatch by showing consistent content during SSR
    if (!mounted) {
        return (
            <div className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-1.5 rounded-lg mr-3 shadow-md">
                                <Award className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                    Certification Center
                                </h1>
                                <p className="text-xs text-blue-600/60 font-normal">Search certifications or browse categories</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded-md"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-1.5 rounded-lg mr-3 shadow-md">
                            <Award className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                Certification Center
                            </h1>
                            <p className="text-xs text-blue-600/60 font-normal">Search certifications or browse categories</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
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
                                    <DropdownMenuItem asChild>
                                        <div className="w-full">
                                            <AuthButtonCore />
                                        </div>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center">
                                <AuthButtonCore />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header