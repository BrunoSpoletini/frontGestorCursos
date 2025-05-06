"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, GraduationCap, LogOut, Menu, User, Home, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DialogTitle } from "@radix-ui/react-dialog";
import React, { useEffect } from "react";
import { StudentProvider, useStudent } from "./StudentContext";
import { enrollmentAPI, courseAPI, gradeAPI, userAPI } from "@/api/api";


function LayoutContent({ children }: { children: ReactNode }) {
    const { user, setUser, isLoading, setIsLoading, setCourses, setEnrollments, setGrades, handleLogout } = useStudent();
    const router = useRouter();
    const pathname = usePathname();
    const navItems = [
        { href: "/student/dashboard", label: "Dashboard", icon: <Home className="h-5 w-5 mr-2" /> },
        { href: "/student/enroll", label: "Enroll", icon: <ClipboardList className="h-5 w-5 mr-2" /> },
        { href: "/student/my-courses", label: "My Courses", icon: <BookOpen className="h-5 w-5 mr-2" /> },
        { href: "/student/my-grades", label: "My Grades", icon: <GraduationCap className="h-5 w-5 mr-2" /> },
    ];

    useEffect(() => {
        async function fetchStudentData() {
            try {
                setIsLoading(true);
                // Fetch user
                const userRes = await userAPI.getMyUser();
                setUser(userRes.data);
                // Fetch all courses
                const coursesRes = await courseAPI.getCourses();
                setCourses(coursesRes.data.results);
                // Fetch enrollments
                const enrollmentsRes = await enrollmentAPI.getMyEnrollments();
                setEnrollments(enrollmentsRes.data.results);
                // Fetch grades
                const gradesRes = await gradeAPI.getMyGrades();
                // Group grades by course using enrollment's course ID
                const gradesByCourse: Record<number, any[]> = {};
                for (const grade of gradesRes.data.results) {
                    const enrollmentObj = enrollmentsRes.data.results.find((enr: any) => enr.id === grade.enrollment);
                    if (!enrollmentObj) continue;
                    const courseId = enrollmentObj.course;
                    if (!gradesByCourse[courseId]) gradesByCourse[courseId] = [];
                    gradesByCourse[courseId].push(grade);
                }
                setGrades(gradesByCourse);
            } catch (e) {
                localStorage.clear();
                router.replace("/login");
            } finally {
                setIsLoading(false);
            }
        }
        fetchStudentData();
    }, [router, setUser, setCourses, setEnrollments, setGrades, setIsLoading]);



    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

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
                                        <h2 className="text-lg font-semibold mb-1">Student Portal</h2>
                                        <p className="text-sm text-muted-foreground">{user?.username}</p>
                                    </div>
                                    <NavItems />
                                </div>
                            </SheetContent>
                        </Sheet>
                        <h1 className="text-xl font-bold">Student Portal</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-medium">{user?.username}</p>
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

export default function StudentLayout({ children }: { children: ReactNode }) {
    return (
        <StudentProvider>
            <LayoutContent>{children}</LayoutContent>
        </StudentProvider>
    );
} 