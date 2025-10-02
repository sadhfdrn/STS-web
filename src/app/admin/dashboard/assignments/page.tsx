'use client';
import { AssignmentForm } from "@/components/admin/assignment-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import type { Assignment } from "@/lib/types";

export default function AdminAssignmentsPage() {
    const firestore = useFirestore();
    const assignmentsQuery = useMemoFirebase(() => {
        if(!firestore) return null;
        return query(
            collection(firestore, 'assignments'),
            orderBy('date', 'desc'),
            limit(5)
        );
    }, [firestore]);
    const { data: recentAssignments, isLoading } = useCollection<Assignment>(assignmentsQuery);
    
    return (
        <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Create Assignment</CardTitle>
                        <CardDescription>Post a new assignment for students.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AssignmentForm />
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-2">
                <h2 className="text-2xl font-headline font-semibold mb-4">Recent Assignments</h2>
                 <Card>
                    <CardContent className="p-0">
                        { isLoading ? <p className="p-4">Loading...</p> : (
                            <ul className="divide-y">
                            {recentAssignments && recentAssignments.map(a => (
                                <li key={a.id} className="p-4">
                                    <h3 className="font-semibold">{a.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{a.description}</p>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 gap-2">
                                        <span className="text-xs font-medium text-primary">{a.subject}</span>
                                        <span className="text-xs text-muted-foreground/80">Deadline: {format(a.deadline.toDate(), 'PP')}</span>
                                    </div>
                                </li>
                            ))}
                            </ul>
                        )}
                    </CardContent>
                 </Card>
            </div>
        </div>
    );
}
