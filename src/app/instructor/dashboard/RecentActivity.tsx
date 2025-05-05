import { BookOpen, GraduationCap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { getRecentActivities, Activity } from "@/lib/getRecentActivities";

// Types for props
import type { Course, Grade } from "@/lib/getRecentActivities";

interface RecentActivityProps {
    courses: Course[];
    grades: Record<number, Grade[]>;
    enrollmentIdToUser: Record<number, string>;
}

export default function RecentActivity({ courses, grades, enrollmentIdToUser }: RecentActivityProps) {
    const shownActivities: Activity[] = getRecentActivities(courses, grades);

    return (
        <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates from your courses</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {shownActivities.length === 0 ? (
                        <div className="text-sm text-muted-foreground">No recent activity.</div>
                    ) : (
                        shownActivities.map((activity) => {
                            if (activity.type === "course") {
                                return (
                                    <div key={`course-${activity.id}`} className="flex items-start space-x-3">
                                        <BookOpen className="h-5 w-5 text-primary mt-1" />
                                        <div>
                                            <div className="font-medium">
                                                New course created: {activity.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">Created by you</div>
                                        </div>
                                    </div>
                                );
                            } else if (activity.type === "grade") {
                                const username = enrollmentIdToUser[activity.enrollment];
                                return (
                                    <div key={`grade-${activity.id}`} className="flex items-start space-x-3">
                                        <GraduationCap className="h- w-5 text-green-600 mt-1" />
                                        <div>
                                            <div className="font-medium">
                                                Grade given: <span className="font-bold">{activity.score}</span> in {activity.courseName}
                                            </div>
                                            {username && (
                                                <span className="text-xs text-muted-foreground">Student: {username}</span>
                                            )}
                                            {activity.comment && (
                                                <div className="text-xs text-muted-foreground">Comment: {activity.comment}</div>
                                            )}
                                            <div className="text-xs text-muted-foreground">
                                                {new Date(activity.created_at).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })
                    )}
                </div>
            </CardContent>
        </Card>
    );
} 