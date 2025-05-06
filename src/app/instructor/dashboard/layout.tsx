"use client"

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { BarChart, BookOpen, GraduationCap, LogOut, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DialogTitle } from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { getUserAuth } from "@/lib/utils";
import { useEffect } from "react";
import { courseAPI, enrollmentAPI, gradeAPI } from "@/api/api";
import { CourseType } from "@/lib/commonTypes";
import { DashboardProvider, useDashboard } from "./DashboardContext";

function LayoutContent({ children }: { children: ReactNode }) {
    const {
        user, setUser,
        courses, setCourses,
        enrollments, setEnrollments,
        grades, setGrades,
        isLoading, setIsLoading
    } = useDashboard();
    const router = useRouter();
    const pathname = usePathname();
    const navItems = [
        { href: "/instructor/dashboard", label: "Dashboard", icon: <BarChart className="h-5 w-5 mr-2" /> },
        { href: "/instructor/dashboard/courses", label: "My Courses", icon: <BookOpen className="h-5 w-5 mr-2" /> },
        { href: "/instructor/dashboard/grades", label: "Grades", icon: <GraduationCap className="h-5 w-5 mr-2" /> },
    ];

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUserAuth(router, "instructor")
                setUser(userData)
                // Fetch courses
                const response = await courseAPI.getCourses()
                if (response.status !== 200) {
                    throw new Error("Failed to fetch courses")
                }
                // Filter courses by instructor
                const filteredCourses = response.data.results.filter((course: CourseType) => course.created_by === userData.username)
                setCourses(filteredCourses)
                // Fetch enrollments
                const responseEnrollments = await enrollmentAPI.getInstructorEnrollments()
                if (responseEnrollments.status !== 200) {
                    throw new Error("Failed to fetch enrollments")
                }
                setEnrollments(responseEnrollments.data.results)
                // Fetch grades
                const gradesData: { [key: number]: any[] } = {}
                for (const course of filteredCourses) {
                    const responseGrades = await gradeAPI.getCourseGrades(course.id)
                    if (responseGrades.status !== 200) {
                        throw new Error("Failed to fetch grades")
                    }
                    gradesData[course.id] = responseGrades.data.length !== 0 ? responseGrades.data : []
                }
                setGrades(gradesData)
            } catch (error) {
                toast.error("Error: " + error)
                localStorage.clear()
            } finally {
                setIsLoading(false)
            }
        }
        fetchUser()
    }, [router, setUser, setCourses, setEnrollments, setGrades, setIsLoading])

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

    const handleLogout = () => {
        localStorage.clear();
        router.push("/login");
        toast.success("Logged out", {
            description: "You have been successfully logged out.",
        });
    };

    const NavItems = () => (
        <nav className="space-y-1">
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm rounded-md ${pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
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
    );

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
                    {children}
                </main>
            </div>
        </div>
    );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <DashboardProvider>
            <LayoutContent>{children}</LayoutContent>
        </DashboardProvider>
    );
} 