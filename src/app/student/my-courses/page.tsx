"use client";

import { useStudent } from "../StudentContext";
import { BookOpen } from "lucide-react";
import React from "react";

export default function MyCoursesPage() {
    const { enrollments, courses, isLoading } = useStudent();
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>Loading your courses...</p>
                </div>
            </div>
        );
    }
    // Get enrolled course IDs
    const enrolledCourseIds = new Set(enrollments.map(e => e.course));
    const enrolledCourses = courses.filter(c => enrolledCourseIds.has(c.id));
    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="h-8 w-8 text-primary" /> My Courses
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {enrolledCourses.length === 0 ? (
                    <div className="col-span-full text-center text-muted-foreground text-lg py-12">
                        You are not enrolled in any courses yet.
                    </div>
                ) : (
                    enrolledCourses.map((course) => (
                        <div key={course.id} className="bg-white rounded-xl border shadow flex flex-col h-full p-6">
                            <div className="flex items-center gap-2 mb-2 text-xl font-semibold">
                                <BookOpen className="h-6 w-6 text-primary" /> {course.name}
                            </div>
                            <div className="text-muted-foreground mb-4 line-clamp-2 min-h-[2.5em]">{course.description}</div>
                            <div className="mt-auto text-xs text-muted-foreground">
                                Course ID: <span className="font-mono">{course.id}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
} 