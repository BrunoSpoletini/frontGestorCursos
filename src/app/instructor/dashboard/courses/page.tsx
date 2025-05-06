"use client";

import { useDashboard } from "../DashboardContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { BookOpen, Edit, Trash2, PlusCircle } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import React, { useState } from "react";
import { courseAPI } from "@/api/api";
import { toast } from "sonner";

export default function CoursesPage() {
    // Get courses from the shared dashboard context
    const { courses, isLoading, setCourses } = useDashboard();

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle form submission
    const handleCreateCourse = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const form = e.currentTarget;
        const name = (form.elements.namedItem("title") as HTMLInputElement).value;
        const description = (form.elements.namedItem("description") as HTMLInputElement).value;
        try {
            const response = await courseAPI.createCourse({ name, description });
            const newCourse = response.data;
            setCourses((prev: any) => [newCourse, ...prev]);
            setShowModal(false);
            form.reset();
        } catch (error: any) {
            toast.error("Failed to create course: " + error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show a loading spinner while fetching
    if (isLoading) {
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
        <div className="p-8">
            {/* Page Title and Add Button */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold mb-1 flex items-center gap-2">
                        <BookOpen className="inline-block h-8 w-8 text-primary" /> My Courses
                    </h2>
                    <p className="text-muted-foreground text-sm">Manage and view all the courses you teach.</p>
                </div>
                <button
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition"
                    onClick={() => setShowModal(true)}
                >
                    <PlusCircle className="h-5 w-5" />
                    Add New Course
                </button>
            </div>

            {/* Modal for creating a new course */}
            <Modal
                open={showModal}
                onOpenChange={setShowModal}
                title="Create New Course"
            >
                <form className="flex flex-col gap-4" onSubmit={handleCreateCourse}>
                    <input
                        type="text"
                        name="title"
                        placeholder="Course Title"
                        className="border rounded px-3 py-2"
                        required
                        disabled={isSubmitting}
                    />
                    <textarea
                        name="description"
                        placeholder="Course Description"
                        className="border rounded px-3 py-2"
                        required
                        disabled={isSubmitting}
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            className="px-4 py-2 rounded bg-gray-200"
                            onClick={() => setShowModal(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-primary text-primary-foreground font-semibold"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating..." : "Create"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Courses Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {courses.length === 0 ? (
                    <div className="col-span-full text-center text-muted-foreground text-lg py-12">
                        You have not created any courses yet.
                    </div>
                ) : (
                    courses.map((course) => (
                        <Card key={course.id} className="shadow-lg border-primary/20 hover:border-primary transition-all group">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl group-hover:text-primary transition">
                                    <BookOpen className="h-5 w-5 text-primary" />
                                    {course.name}
                                </CardTitle>
                                <CardDescription className="line-clamp-2 min-h-[2.5em]">
                                    {course.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Placeholder for more course info, stats, etc. */}
                                <div className="text-xs text-muted-foreground">
                                    Course ID: <span className="font-mono">{course.id}</span>
                                </div>
                            </CardContent>
                            <CardFooter className="flex gap-2 justify-end">
                                {/* Placeholder action buttons */}
                                <button className="flex items-center gap-1 px-3 py-1 rounded bg-muted hover:bg-primary/10 text-primary text-xs font-medium transition">
                                    <Edit className="h-4 w-4" /> Edit
                                </button>
                                <button className="flex items-center gap-1 px-3 py-1 rounded bg-destructive/10 hover:bg-destructive/20 text-destructive text-xs font-medium transition">
                                    <Trash2 className="h-4 w-4" /> Delete
                                </button>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
} 