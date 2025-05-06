// Common types for the project

export type UserType = {
    id: number;
    username: string;
    role: "admin" | "instructor" | "student";
  };
  
  export type CourseType = {
    id: number;
    name: string;
    description: string;
    created_by: number | string;
  };
  
  export type Enrollment = {
    id: number;
    user: string;
    course: number;
    created_at: string;
  };
  
  export type Grade = {
    id: number;
    enrollment: number;
    created_at: string;
    score: number | string;
    comment: string;
  };
  
  // For paginated API responses
  export type PaginatedResponse<T> = {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
  };
  
  // For mapping enrollmentId to username
  export type EnrollmentIdToUserMap = Record<number, string>;
  