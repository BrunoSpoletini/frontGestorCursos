"use client";

import { useStudent } from "../StudentContext";
import { BookOpen, GraduationCap, MessageCircle } from "lucide-react";
import React from "react";

export default function MyGradesPage() {
    const { grades, courses, isLoading } = useStudent();
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>Loading your grades...</p>
                </div>
            </div>
        );
    }
    // Flatten all grades into a single array for display
    const allGrades = courses.flatMap((course) =>
        (grades[course.id] || []).map((grade) => ({
            ...grade,
            courseName: course.name,
        }))
    );
    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
                <GraduationCap className="h-8 w-8 text-green-600" /> My Grades
            </h1>
            <div className="overflow-x-auto rounded-lg shadow border border-muted">
                <table className="min-w-full divide-y divide-muted bg-background">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Course</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Score</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Comment</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-muted">
                        {allGrades.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-12 text-muted-foreground text-lg">
                                    You have not received any grades yet.
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