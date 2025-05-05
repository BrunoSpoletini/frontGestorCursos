"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { toast } from "sonner"
import { Menu, User, BookOpen, GraduationCap, BarChart, LogOut } from "lucide-react"
import { DialogTitle } from "@radix-ui/react-dialog"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { getUserAuth } from "@/lib/utils"
import { courseAPI, enrollmentAPI, gradeAPI } from "@/api/api"
import { getRecentActivities, Activity } from "@/lib/getRecentActivities"
import RecentActivity from "./RecentActivity"

type UserType = {
    id: number
    username: string
    role: "admin" | "instructor" | "student"
}

type CourseType = {
    id: number
    name: string
    description: string
    created_by: number
}

type Enrollment = {
    id: number
    user: string
    course: number
    created_at: string
}

type Grade = {
    id: number
    enrollment: number
    created_at: string
    score: number
    comment: string
}
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserType | null>(null)
    const [courses, setCourses] = useState<CourseType[]>([])
    const [enrollments, setEnrollments] = useState<Enrollment[]>([])
    const [grades, setGrades] = useState<{ [key: number]: Grade[] }>({})
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUserAuth(router, "instructor")
                setUser(userData)

                const response = await courseAPI.getCourses()

                if (response.status !== 200) {
                    throw new Error("Failed to fetch courses")
                }

                // Filter courses by instructor
                const filteredCourses = response.data.results.filter((course: CourseType) => course.created_by === userData.username)
                console.log("filteredCourses", response)
                setCourses(filteredCourses)
                console.log(filteredCourses)

                // Fetch enrollments of filtered courses
                const responseEnrollments = await enrollmentAPI.getInstructorEnrollments()
                if (responseEnrollments.status !== 200) {
                    throw new Error("Failed to fetch enrollments")
                }
                const enrollmentsData = responseEnrollments.data.results
                setEnrollments(enrollmentsData)
                console.log(enrollmentsData)

                // Fetch grades of filtered courses
                const gradesData: { [key: number]: Grade[] } = {}
                for (const course of filteredCourses) {
                    const responseGrades = await gradeAPI.getCourseGrades(course.id)
                    console.log("responseGrades", responseGrades)
                    if (responseGrades.status !== 200) {
                        throw new Error("Failed to fetch grades")
                    }
                    const gradesResp = responseGrades.data.length != 0 ? responseGrades.data : []
                    gradesData[course.id] = gradesResp
                }
                console.log(gradesData)
                setGrades(gradesData)

            } catch (error) {
                toast.error("Error: " + error)
                localStorage.clear()
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
        return [
            { href: "/instructor/dashboard", label: "Dashboard", icon: <BarChart className="h-5 w-5 mr-2" /> },
            { href: "/instructor/courses", label: "My Courses", icon: <BookOpen className="h-5 w-5 mr-2" /> },
            { href: "/instructor/grades", label: "Grades", icon: <GraduationCap className="h-5 w-5 mr-2" /> },
        ]
    }

    const navItems = getNavItems()

    const NavItems = () => (
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
    )

    return (
        <div className="flex min-h-screen flex-col">
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="mx-4 px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-64">
                                <DialogTitle className="sr-only">Navigation Menu</DialogTitle>
                                <div className="py-4">
                                    <div className="px-3 py-2 mb-6">
                                        <h2 className="text-lg font-semibold mb-1">Course Manager</h2>
                                        <p className="text-sm text-muted-foreground">{user?.username}</p>
                                        <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                                    </div>
                                    <NavItems />
                                </div>
                            </SheetContent>
                        </Sheet>
                        <h1 className="text-xl font-bold">Course Manager</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-medium">{user?.username}</p>
                            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                        </div>
                        <User className="h-8 w-8" />
                    </div>
                </div>
            </header>
            <div className="flex flex-1">
                <aside className="hidden md:block w-64 border-r bg-muted/30">
                    <div className="p-4 space-y-1">
                        <NavItems />
                    </div>
                </aside>
                <main className="flex-1">
                    {/* <div className="container mx-auto p-4 md:p-6">{children}</div>*/}



                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Active Courses</CardTitle>
                                <CardDescription>Your current teaching load</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{courses.length}</div>
                                <p className="text-xs text-muted-foreground">Courses this semester</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Total Students</CardTitle>
                                <CardDescription>Students enrolled in your courses</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {
                                        Array.from(
                                            new Set(enrollments.map((enrollment) => enrollment.user))
                                        ).length
                                    }
                                </div>
                                <p className="text-xs text-muted-foreground">Across all courses</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Grades Given</CardTitle>
                                <CardDescription>Total grades assigned this semester</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {
                                        Object.values(grades || {}).reduce((acc, curr) => acc + (Array.isArray(curr) ? curr.length : 0), 0)
                                    }
                                </div>
                                <p className="text-xs text-muted-foreground">Assignments graded</p>
                            </CardContent>
                        </Card>

                        {/* Create enrollmentIdToUser mapping and pass to RecentActivity */}
                        {(() => {
                            const enrollmentIdToUser: Record<number, string> = {};
                            enrollments.forEach((enrollment) => {
                                enrollmentIdToUser[enrollment.id] = enrollment.user;
                            });
                            return <RecentActivity courses={courses} grades={grades} enrollmentIdToUser={enrollmentIdToUser} />;
                        })()}
                    </div>
                </main>
            </div>
        </div>
    )
}
