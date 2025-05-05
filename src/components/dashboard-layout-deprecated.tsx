"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { toast } from "sonner"
import { Menu, User, BookOpen, GraduationCap, BarChart, LogOut } from "lucide-react"

type UserType = {
    id: number
    username: string
    role: "admin" | "instructor" | "student"
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserType | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token")

                if (!token) {
                    router.push("/login")
                    return
                }

                // Try to get user from localStorage first
                const storedUser = localStorage.getItem("user")
                if (storedUser) {
                    setUser(JSON.parse(storedUser))
                    setIsLoading(false)
                    return
                }

                // If not in localStorage, fetch from API
                const response = await fetch("/api/my-user/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!response.ok) {
                    throw new Error("Failed to fetch user profile")
                }

                const userData = await response.json()
                setUser(userData)
                localStorage.setItem("user", JSON.stringify(userData))
            } catch (error) {
                localStorage.removeItem("token")
                localStorage.removeItem("refreshToken")
                localStorage.removeItem("user")
                router.push("/login")
            } finally {
                setIsLoading(false)
            }
        }

        fetchUser()
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")
        router.push("/login")
        toast.success("Logged out", {
            description: "You have been successfully logged out.",
        })
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>Loading...</p>
                </div>
            </div>
        )
    }

    const getNavItems = () => {
        if (!user) return []

        if (user.role === "admin") {
            return [
                { href: "/admin/dashboard", label: "Dashboard", icon: <BarChart className="h-5 w-5 mr-2" /> },
                { href: "/admin/users", label: "Users", icon: <User className="h-5 w-5 mr-2" /> },
                { href: "/admin/courses", label: "Courses", icon: <BookOpen className="h-5 w-5 mr-2" /> },
            ]
        } else if (user.role === "instructor") {
            return [
                { href: "/instructor/dashboard", label: "Dashboard", icon: <BarChart className="h-5 w-5 mr-2" /> },
                { href: "/instructor/courses", label: "My Courses", icon: <BookOpen className="h-5 w-5 mr-2" /> },
                { href: "/instructor/grades", label: "Grades", icon: <GraduationCap className="h-5 w-5 mr-2" /> },
            ]
        } else {
            return [
                { href: "/student/dashboard", label: "Dashboard", icon: <BarChart className="h-5 w-5 mr-2" /> },
                { href: "/student/courses", label: "My Courses", icon: <BookOpen className="h-5 w-5 mr-2" /> },
                { href: "/student/grades", label: "My Grades", icon: <GraduationCap className="h-5 w-5 mr-2" /> },
            ]
        }
    }

    const navItems = getNavItems()

    return (
        <div className="flex min-h-screen flex-col">
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-64">
                                <div className="py-4">
                                    <div className="px-3 py-2 mb-6">
                                        <h2 className="text-lg font-semibold mb-1">Course Manager</h2>
                                        <p className="text-sm text-muted-foreground">{user?.username}</p>
                                        <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                                    </div>
                                    <nav className="space-y-1">
                                        {navItems.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={`flex items-center px-3 py-2 text-sm rounded-md ${pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                                                    }`}
                                            >
                                                {item.icon}
                                                {item.label}
                                            </Link>
                                        ))}
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center px-3 py-2 text-sm rounded-md w-full text-left hover:bg-muted"
                                        >
                                            <LogOut className="h-5 w-5 mr-2" />
                                            Logout
                                        </button>
                                    </nav>
                                </div>
                            </SheetContent>
                        </Sheet>
                        <h1 className="text-xl font-bold ml-2">Course Manager</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-medium">{user?.username}</p>
                            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden md:flex">
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>
            <div className="flex flex-1">
                <aside className="hidden md:block w-64 border-r bg-muted/30">
                    <div className="p-4 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center px-3 py-2 text-sm rounded-md ${pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </aside>
                <main className="flex-1">
                    <div className="container mx-auto p-4 md:p-6">{children}</div>
                </main>
            </div>
        </div>
    )
}
