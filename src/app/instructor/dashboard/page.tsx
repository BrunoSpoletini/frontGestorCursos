"use client"

import { useDashboard } from "./DashboardContext";
import RecentActivity from "./RecentActivity";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
    const { courses, enrollments, grades, isLoading } = useDashboard();

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

    // Create enrollmentIdToUser mapping for RecentActivity
    const enrollmentIdToUser: Record<number, string> = {};
    enrollments.forEach((enrollment) => {
        enrollmentIdToUser[enrollment.id] = enrollment.user;
    });

    return (
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
                        {Array.from(new Set(enrollments.map((enrollment) => enrollment.user))).length}
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
                        {Object.values(grades || {}).reduce((acc, curr) => acc + (Array.isArray(curr) ? curr.length : 0), 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">Assignments graded</p>
                </CardContent>
            </Card>
            <RecentActivity courses={courses} grades={grades} enrollmentIdToUser={enrollmentIdToUser} />
        </div>
    );
}
