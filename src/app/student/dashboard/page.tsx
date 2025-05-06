"use client";

import { useStudent } from "../StudentContext";
import { BookOpen, GraduationCap } from "lucide-react";
import React from "react";

export default function StudentDashboard() {
    const { user, courses, enrollments, grades, isLoading } = useStudent();
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }
    const totalGrades = Object.values(grades).reduce((acc, arr) => acc + arr.length, 0);
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Welcome, {user?.username}!</h1>
            <div className="grid gap-6 sm:grid-cols-2">
                <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
                    <BookOpen className="h-10 w-10 text-primary" />
                    <div>
                        <div className="text-2xl font-bold">{enrollments.length}</div>
                        <div className="text-muted-foreground">Enrolled Courses</div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
                    <GraduationCap className="h-10 w-10 text-green-600" />
                    <div>
                        <div className="text-2xl font-bold">{totalGrades}</div>
                        <div className="text-muted-foreground">Grades Received</div>
                    </div>
                </div>
            </div>
        </div>
    );
} 