import React, { createContext, useContext, useEffect, useState } from "react";
import type { CourseType, Enrollment, Grade, UserType } from "@/lib/commonTypes";
import { useRouter } from "next/navigation";

export type StudentContextType = {
    user: UserType | null;
    setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
    courses: CourseType[];
    setCourses: React.Dispatch<React.SetStateAction<CourseType[]>>;
    enrollments: Enrollment[];
    setEnrollments: React.Dispatch<React.SetStateAction<Enrollment[]>>;
    grades: Record<number, Grade[]>;
    setGrades: React.Dispatch<React.SetStateAction<Record<number, Grade[]>>>;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    handleLogout: () => void;
};

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [courses, setCourses] = useState<CourseType[]>([]);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [grades, setGrades] = useState<Record<number, Grade[]>>({});
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check authentication before any API calls
        const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
        if (!storedUser) {
            router.replace("/login");
            return;
        }
        setUser(JSON.parse(storedUser));
        setIsLoading(false);

    }, [router]);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    return (
        <StudentContext.Provider value={{
            user, setUser,
            courses, setCourses,
            enrollments, setEnrollments,
            grades, setGrades,
            isLoading, setIsLoading,
            handleLogout,
        }}>
            {children}
        </StudentContext.Provider>
    );
};

export const useStudent = () => {
    const ctx = useContext(StudentContext);
    if (!ctx) throw new Error("useStudent must be used within a StudentProvider");
    return ctx;
}; 