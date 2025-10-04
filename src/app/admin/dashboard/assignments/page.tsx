import { AssignmentForm } from "@/components/admin/assignment-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import type { Assignment } from "@/lib/types";
import { getAssignments } from "@/lib/db";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteAssignment } from "@/lib/actions";
import { UploadAnswerButton } from "@/components/admin/upload-answer-button";

async function getRecentAssignments() {
    const assignments = await getAssignments();
    return assignments.slice(0, 5);
}

export default async function AdminAssignmentsPage() {
    const recentAssignments = await getRecentAssignments();
    
    return (
        <div className="grid gap-6 md:gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="font-headline text-xl sm:text-2xl">Create Assignment</CardTitle>
                        <CardDescription className="text-xs sm:text-sm">Post a new assignment for students.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AssignmentForm />
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-2">
                <h2 className="text-xl sm:text-2xl font-headline font-semibold mb-4">Recent Assignments</h2>
                 <Card>
                    <CardContent className="p-0">
                        <ul className="divide-y">
                        {recentAssignments.map(a => (
                            <li key={a.id} className="p-3 sm:p-4 group">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-sm sm:text-base">{a.title}</h3>
                                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{a.description}</p>
                                    </div>
                                    <DeleteButton
                                        id={a.id}
                                        deleteAction={deleteAssignment}
                                        itemName={a.title}
                                        itemType="Assignment"
                                    />
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-primary">{a.subject}</span>
                                        {a.answerFileUrl && (
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                                Has Answer
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xs text-muted-foreground/80">Deadline: {format(a.deadline, 'MMM d, yyyy')}</span>
                                        <UploadAnswerButton
                                            assignmentId={a.id}
                                            assignmentTitle={a.title}
                                            hasAnswer={!!a.answerFileUrl}
                                        />
                                    </div>
                                </div>
                            </li>
                        ))}
                        </ul>
                    </CardContent>
                 </Card>
            </div>
        </div>
    );
}
