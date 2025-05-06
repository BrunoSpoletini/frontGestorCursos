import { CourseType, Grade } from "./commonTypes";


export type Activity =
  | { type: 'course'; id: number; name: string }
  | { type: 'grade'; id: number; created_at: string; score: number | string; comment: string; courseName: string; enrollment: number };

/**
 * Combines recent courses and grades into a unified, sorted activity list.
 * @param courses Array of courses
 * @param grades Object mapping courseId to array of grades
 * @returns Array of up to 5 most recent activities
 */
export function getRecentActivities(
  courses: CourseType[],
  grades: Record<number, Grade[]>
): Activity[] {
  // Get recent courses (sorted by id descending, as a proxy for creation time)
  const recentCourses = courses
    .slice()
    .sort((a, b) => b.id - a.id)
    .slice(0, 3);

  // Get recent grades (flatten all grades, sort by created_at descending)
  const allGrades: (Grade & { courseId: number; courseName: string })[] = [];
  for (const course of courses) {
    (grades[course.id] || []).forEach((grade) => {
      allGrades.push({
        ...grade,
        courseId: course.id,
        courseName: course.name,
      });
    });
  }
  const recentGrades = allGrades
    .slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  // Merge and sort by time: use course.id for courses (proxy for time), created_at for grades
  const activities: Activity[] = [
    ...recentCourses.map((course) => ({
      type: 'course' as const,
      id: course.id,
      name: course.name,
    })),
    ...recentGrades.map((grade) => ({
      type: 'grade' as const,
      id: grade.id,
      created_at: grade.created_at,
      score: grade.score,
      comment: grade.comment,
      courseName: grade.courseName,
      enrollment: grade.enrollment,
    })),
  ];

  activities.sort((a, b) => {
    if (a.type === 'grade' && b.type === 'grade') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (a.type === 'course' && b.type === 'course') {
      return b.id - a.id;
    }
    if (a.type === 'grade' && b.type === 'course') {
      const courseTime = b.id;
      const gradeTime = new Date(a.created_at).getTime();
      return gradeTime < courseTime ? 1 : -1;
    }
    if (a.type === 'course' && b.type === 'grade') {
      const courseTime = a.id;
      const gradeTime = new Date(b.created_at).getTime();
      return courseTime < gradeTime ? 1 : -1;
    }
    return 0;
  });

  // Show up to 5 most recent activities
  return activities.slice(0, 5);
} 