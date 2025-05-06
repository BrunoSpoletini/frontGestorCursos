import React, { createContext, useContext, useState } from "react";
import type { CourseType, Enrollment, Grade, UserType } from "@/lib/commonTypes";

export type DashboardContextType = {
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
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [courses, setCourses] = useState<CourseType[]>([]);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [grades, setGrades] = useState<Record<number, Grade[]>>({});
    const [isLoading, setIsLoading] = useState(true);

    return (
        <DashboardContext.Provider value={{
            user, setUser,
            courses, setCourses,
            enrollments, setEnrollments,
            grades, setGrades,
            isLoading, setIsLoading
        }}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => {
    const ctx = useContext(DashboardContext);
    if (!ctx) throw new Error("useDashboard must be used within a DashboardProvider");
    return ctx;
};