"use client";

import { useDashboard } from "../InstructorContext";
import { BookOpen, User, ChevronDown, ChevronRight, Pencil } from "lucide-react";
import { toast } from "sonner";
import React, { useState } from "react";

export default function GradeStudentsPage() {
    const { courses, enrollments, setGrades, grades } = useDashboard();
    // Compute enrollmentIdToUser locally
    const enrollmentIdToUser: Record<number, string> = {};
    enrollments.forEach((enrollment) => {
        enrollmentIdToUser[enrollment.id] = enrollment.user;
    });
    // Helper: get set of graded enrollment IDs for each course
    const gradedEnrollmentIdsByCourse: Record<number, Set<number>> = {};
    Object.entries(grades).forEach(([courseId, gradeList]) => {
        gradedEnrollmentIdsByCourse[Number(courseId)] = new Set(gradeList.map(g => g.enrollment));
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [batchGrades, setBatchGrades] = useState<Record<number, { score: string; comment: string }>>({});
    const [expanded, setExpanded] = useState<Record<number, boolean>>({});

    // Group enrollments by course, filtering out already graded
    const enrollmentsByCourse = courses.reduce((acc, course) => {
        const gradedSet = gradedEnrollmentIdsByCourse[course.id] || new Set();
        acc[course.id] = enrollments.filter((enr) => enr.course === course.id && !gradedSet.has(enr.id));
        return acc;
    }, {} as Record<number, typeof enrollments>);

    const toggleExpand = (enrollmentId: number) => {
        setExpanded((prev) => ({ ...prev, [enrollmentId]: !prev[enrollmentId] }));
    };

    const handleBatchInput = (enrollmentId: number, field: "score" | "comment", value: string) => {
        setBatchGrades((prev) => ({
            ...prev,
            [enrollmentId]: {
                ...prev[enrollmentId],
                [field]: value,
            },
        }));
    };

    const handleBatchGradeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const toSubmit = Object.entries(batchGrades)
            .filter(([_, v]) => v.score && v.score !== "")
            .map(([enrollment, v]) => ({
                enrollment: Number(enrollment),
                score: v.score,
                comment: v.comment,
            }));
        if (toSubmit.length === 0) {
            toast.error("Please enter at least one grade.");
            setIsSubmitting(false);
            return;
        }
        try {
            const { gradeAPI } = await import("@/api/api");
            const results = await Promise.all(
                toSubmit.map((g) => gradeAPI.createGrade(g).then((res) => ({ ...g, data: res.data })).catch((err) => ({ ...g, error: err })))
            );
            let updated = false;
            results.forEach((result) => {
                if ("data" in result) {
                    const enrollmentObj = enrollments.find((enr) => enr.id === result.enrollment);
                    if (enrollmentObj) {
                        setGrades((prev: any) => ({
                            ...prev,
                            [enrollmentObj.course]: [result.data, ...(prev[enrollmentObj.course] || [])],
                        }));
                        updated = true;
                    }
                } else if ("error" in result) {
                    toast.error(`Failed to create grade for enrollment ${result.enrollment}: ${result.error}`);
                }
            });
            if (updated) {
                setBatchGrades({});
                setExpanded({});
                toast.success("Grades created successfully!");
            }
        } catch (error) {
            toast.error("Failed to create grades: " + error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Check if there are any students to grade
    const hasStudents = courses.some(course => enrollmentsByCourse[course.id]?.length > 0);

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3 text-primary">
                <Pencil className="h-8 w-8" /> Grade Students
            </h1>
            <p className="text-muted-foreground mb-8 text-lg">Grade students enrolled in your courses. Click a student to expand and enter their grade.</p>
            {hasStudents ? (
                <form className="flex flex-col gap-8" onSubmit={handleBatchGradeSubmit}>
                    {courses.map((course) => (
                        <div key={course.id} className="border rounded-2xl p-6 bg-muted/40 shadow-lg">
                            <div className="flex items-center gap-2 font-semibold mb-4 text-xl text-primary">
                                <BookOpen className="h-6 w-6" /> {course.name}
                            </div>
                            {enrollmentsByCourse[course.id]?.length ? (
                                <div className="flex flex-col gap-3">
                                    {enrollmentsByCourse[course.id].map((enr) => {
                                        const isOpen = !!expanded[enr.id];
                                        return (
                                            <div key={enr.id} className="bg-white rounded-xl shadow group hover:bg-primary/5 transition">
                                                <button
                                                    type="button"
                                                    className="flex items-center gap-2 w-full px-4 py-3 focus:outline-none"
                                                    onClick={() => toggleExpand(enr.id)}
                                                    aria-expanded={isOpen}
                                                >
                                                    {isOpen ? (
                                                        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
                                                    ) : (
                                                        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform" />
                                                    )}
                                                    <User className="h-5 w-5 text-muted-foreground" />
                                                    <span className="font-mono text-base text-muted-foreground">
                                                        {enrollmentIdToUser[enr.id]}
                                                    </span>
                                                </button>
                                                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                                                    {isOpen && (
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 pb-4 pt-2">
                                                            <input
                                                                type="number"
                                                                placeholder="Score"
                                                                className="border rounded px-3 py-2 w-32 focus:ring-2 focus:ring-primary text-lg"
                                                                value={batchGrades[enr.id]?.score || ""}
                                                                onChange={(e) => handleBatchInput(enr.id, "score", e.target.value)}
                                                                disabled={isSubmitting}
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder="Comment (optional)"
                                                                className="border rounded px-3 py-2 flex-1 focus:ring-2 focus:ring-primary text-lg"
                                                                value={batchGrades[enr.id]?.comment || ""}
                                                                onChange={(e) => handleBatchInput(enr.id, "comment", e.target.value)}
                                                                disabled={isSubmitting}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-muted-foreground text-base">No students enrolled.</div>
                            )}
                        </div>
                    ))}
                    <div className="flex flex-col sm:flex-row justify-end gap-2 mt-2">
                        <button
                            type="submit"
                            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition shadow"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating..." : "Create Grades"}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">No students to grade</h2>
                    <p className="text-muted-foreground mb-4">There are currently no students enrolled in your courses. Once students enroll, you will be able to grade them here.</p>
                </div>
            )}
        </div>
    );
} 