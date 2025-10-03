import { SubjectForm } from "@/components/admin/subject-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSubjects } from "@/lib/db";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteSubject } from "@/lib/actions";

export default async function AdminSubjectsPage() {
    const subjects = await getSubjects();
    
    return (
        <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Create Subject</CardTitle>
                        <CardDescription>Add a new subject category.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SubjectForm />
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-2">
                <h2 className="text-2xl font-headline font-semibold mb-4">Existing Subjects</h2>
                 <Card>
                    <CardContent className="p-0">
                        {subjects.length > 0 ? (
                            <ul className="divide-y">
                            {subjects.map(s => (
                                <li key={s.id} className="p-4 group flex justify-between items-center">
                                    <h3 className="font-semibold">{s.name}</h3>
                                    <DeleteButton
                                        id={s.id}
                                        deleteAction={deleteSubject}
                                        itemName={s.name}
                                        itemType="Subject"
                                    />
                                </li>
                            ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground p-4 text-center">No subjects created yet.</p>
                        )}
                    </CardContent>
                 </Card>
            </div>
        </div>
    );
}
