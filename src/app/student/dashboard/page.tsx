"use client";

import { useStudent } from "../StudentContext";
import { BookOpen, GraduationCap, MessageCircle, Star } from "lucide-react";
import React from "react";

function getRecentGrades(allGrades: any[], courses: any[]) {
    return allGrades
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .map((grade) => ({
            ...grade,
            courseName: courses.find((c) => c.id === grade.courseId)?.name || "Unknown",
        }));
}

function getAverageGrade(allGrades: any[]) {
    if (allGrades.length === 0) return null;
    // Only use numeric grades
    const numericGrades = allGrades.map(g => parseFloat(g.score)).filter(n => !isNaN(n));
    if (numericGrades.length === 0) return null;
    const avg = numericGrades.reduce((a, b) => a + b, 0) / numericGrades.length;
    return avg.toFixed(2);
}

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
    // Data prep
    const enrolledCourseIds = new Set(enrollments.map(e => e.course));
    const enrolledCourses = courses.filter(c => enrolledCourseIds.has(c.id));
    // Flatten all grades with courseId
    const allGrades = courses.flatMap((course) =>
        (grades[course.id] || []).map((grade) => ({ ...grade, courseId: course.id }))
    );
    const totalGrades = allGrades.length;
    const avgGrade = getAverageGrade(allGrades);
    const recentGrades = getRecentGrades(allGrades, courses);

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Welcome, {user?.username}!</h1>
            <div className="grid gap-6 sm:grid-cols-2 mb-8">
                <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
                    <BookOpen className="h-10 w-10 text-primary" />
                    <div>
                        <div className="text-2xl font-bold">{enrolledCourses.length}</div>
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
                <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4 col-span-2">
                    <Star className="h-10 w-10 text-yellow-400" />
                    <div>
                        <div className="text-2xl font-bold">{avgGrade !== null ? avgGrade : '--'}</div>
                        <div className="text-muted-foreground">Overall Average Grade</div>
                    </div>
                </div>
            </div>
            {/* Recent Grades */}
            <div className="bg-white rounded-xl shadow p-6">
                <div className="font-semibold mb-4 flex items-center gap-2 text-lg text-primary"><MessageCircle className="h-5 w-5" /> Recent Grades</div>
                {recentGrades.length === 0 ? (
                    <div className="text-muted-foreground">No recent grades.</div>
                ) : (
                    <ul className="divide-y divide-muted">
                        {recentGrades.map((grade) => (
                            <li key={grade.id} className="py-4">
                                <div className="flex gap-4 items-center">
                                    <div className="h-12 w-1 rounded bg-green-200 mr-4" />
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                                            <div className="flex items-center gap-2 min-w-[120px]">
                                                <BookOpen className="h-5 w-5 text-primary" />
                                                <span className="font-bold text-lg text-primary">{grade.courseName}</span>
                                            </div>
                                            <span className="font-mono text-green-700 bg-green-100 border border-green-200 rounded-lg px-3 py-1 text-xl shadow-sm">{grade.score}</span>
                                            <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date(grade.created_at).toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2 ml-7">
                                            <span className="text-xs font-semibold text-muted-foreground">Comments:</span>
                                            <span className="text-sm italic px-2 py-1 rounded bg-muted/50 text-muted-foreground max-w-xs truncate">{grade.comment || "No comment"}</span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
} 