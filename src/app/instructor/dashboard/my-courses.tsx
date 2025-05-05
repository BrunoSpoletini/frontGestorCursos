import { Course } from "@/lib/getRecentActivities";

type Grade = {
    id: number
    enrollment: number
    created_at: string
    score: number
    comment: string
}

export default function MyCourses({ courses, grades }: { courses: Course[], grades: { [key: number]: Grade[] } }) {

    return (
        <div>
            <h1>My Courses</h1>
        </div>
    )
}