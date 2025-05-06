"use client";

import { useDashboard } from "../DashboardContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { GraduationCap, User, BookOpen, MessageCircle, PlusCircle } from "lucide-react";

export default function GradesPage() {
    // Get grades, courses, and enrollments from the shared dashboard context
    const { grades, courses, enrollments, isLoading } = useDashboard();

    // Create a mapping from enrollmentId to username for quick lookup
    const enrollmentIdToUser: Record<number, string> = {};
    enrollments.forEach((enrollment) => {
        enrollmentIdToUser[enrollment.id] = enrollment.user;
    });

    // Flatten all grades into a single array for display
    const allGrades = courses.flatMap((course) =>
        (grades[course.id] || []).map((grade) => ({
            ...grade,
            courseName: course.name,
        }))
    );

    // Show a loading spinner while fetching
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>Loading grades...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Page Title and Add Button */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold mb-1 flex items-center gap-2">
                        <GraduationCap className="inline-block h-8 w-8 text-green-600" /> Grades
                    </h2>
                    <p className="text-muted-foreground text-sm">View and manage all grades you have assigned.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition">
                    <PlusCircle className="h-5 w-5" />
                    Add New Grade
                </button>
            </div>

            {/* Grades Table */}
            <div className="overflow-x-auto rounded-lg shadow border border-muted">
                <table className="min-w-full divide-y divide-muted bg-background">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Course</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Student</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Score</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Comment</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-muted">
                        {allGrades.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-12 text-muted-foreground text-lg">
                                    No grades have been assigned yet.
                                </td>
                            </tr>
                        ) : (
                            allGrades.map((grade) => (
                                <tr key={grade.id} className="hover:bg-muted/30 transition">
                                    {/* Course Name */}
                                    <td className="px-4 py-3 whitespace-nowrap font-medium">
                                        <span className="inline-flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-primary" />
                                            {grade.courseName}
                                        </span>
                                    </td>
                                    {/* Student Username */}
                                    <td className="px-4 py-3 whitespace-nowrap font-medium">
                                        <span className="inline-flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-mono text-xs">{enrollmentIdToUser[grade.enrollment] || "-"}</span>
                                        </span>
                                    </td>
                                    {/* Score */}
                                    <td className="px-4 py-3 whitespace-nowrap font-bold text-green-700 text-lg text-left">
                                        {grade.score}
                                    </td>
                                    {/* Comment */}
                                    <td className="px-4 py-3 whitespace-nowrap text-sm flex items-center gap-2">
                                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                                        {grade.comment ? (
                                            <span className="line-clamp-1 max-w-[12rem]">{grade.comment}</span>
                                        ) : (
                                            <span className="italic text-muted-foreground">No comment</span>
                                        )}
                                    </td>
                                    {/* Date */}
                                    <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
                                        {new Date(grade.created_at).toLocaleString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 