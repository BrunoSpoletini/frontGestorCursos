"use client";

import { useStudent } from "../StudentContext";
import { BookOpen, ClipboardList, CheckCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { enrollmentAPI, courseAPI } from "@/api/api";
import { toast } from "sonner";

export default function EnrollPage() {
    const { enrollments, setEnrollments, user } = useStudent();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [enrolling, setEnrolling] = useState<number | null>(null);

    useEffect(() => {
        async function fetchCourses() {
            setLoading(true);
            try {
                const res = await courseAPI.getCourses();
                setCourses(res.data.results);
            } catch (e) {
                toast.error("Failed to load courses");
            } finally {
                setLoading(false);
            }
        }
        fetchCourses();
    }, []);

    const enrolledCourseIds = new Set(enrollments.map(e => e.course));

    const handleEnroll = async (courseId: number) => {
        setEnrolling(courseId);
        try {
            const res = await enrollmentAPI.enroll(courseId);
            setEnrollments(prev => [...prev, res.data]);
            toast.success("Enrolled successfully!");
        } catch (e) {
            toast.error("Failed to enroll");
        } finally {
            setEnrolling(null);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>Loading courses...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
                <ClipboardList className="h-8 w-8 text-primary" /> Enroll in Courses
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {courses.map((course) => (
                    <div key={course.id} className="bg-white rounded-xl border shadow flex flex-col h-full p-6">
                        <div className="flex items-center gap-2 mb-2 text-xl font-semibold">
                            <BookOpen className="h-5 w-5 text-primary min-w-5" /> {course.name}
                        </div>
                        <div className="text-muted-foreground mb-4 line-clamp-2 min-h-[2.5em]">{course.description}</div>
                        <div className="mt-auto flex items-center gap-2 min-h-[32px]">
                            {enrolledCourseIds.has(course.id) ? (
                                <span className="flex items-center gap-1 text-green-600 font-medium">
                                    <CheckCircle className="h-5 w-5 min-w-5" /> Enrolled
                                </span>
                            ) : (
                                <button
                                    className="px-4 py-2 rounded bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition"
                                    onClick={() => handleEnroll(course.id)}
                                    disabled={enrolling === course.id}
                                >
                                    {enrolling === course.id ? "Enrolling..." : "Enroll"}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 