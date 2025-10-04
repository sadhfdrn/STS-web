import { MaterialUploadForm } from "@/components/admin/material-upload-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Subject, CourseMaterial } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { FileText, Image, Video } from "lucide-react";
import { getCourseMaterials, getSubjects } from "@/lib/db";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteMaterial } from "@/lib/actions";

const fileTypeIcons = {
  pdf: <FileText className="h-5 w-5 text-muted-foreground" />,
  image: <Image className="h-5 w-5 text-muted-foreground" />,
  video: <Video className="h-5 w-5 text-muted-foreground" />,
};

async function getMaterialsBySubject() {
    const courseMaterials = await getCourseMaterials();
    const subjects = await getSubjects();
    const materialsBySubject = subjects.reduce((acc, subject) => {
        acc[subject.name] = courseMaterials.filter(m => m.subject === subject.name);
        return acc;
    }, {} as Record<string, CourseMaterial[]>);
    return { materialsBySubject, subjects };
}

export default async function AdminMaterialsPage() {
    const { materialsBySubject, subjects } = await getMaterialsBySubject();

    return (
        <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Upload Material</CardTitle>
                        <CardDescription>Add a new file to a subject.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <MaterialUploadForm />
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-2">
                <h2 className="text-2xl font-headline font-semibold mb-4">Course Materials by Subject</h2>
                <Card>
                    <CardContent className="p-4">
                        <Accordion type="single" collapsible className="w-full">
                            {subjects.map(subject => (
                                <AccordionItem value={subject.name} key={subject.id}>
                                    <AccordionTrigger className="font-headline">{subject.name} ({materialsBySubject[subject.name]?.length || 0})</AccordionTrigger>
                                    <AccordionContent>
                                        {materialsBySubject[subject.name] && materialsBySubject[subject.name].length > 0 ? (
                                            <ul className="divide-y">
                                                {materialsBySubject[subject.name].map(m => (
                                                    <li key={m.id} className="p-4 flex items-center space-x-4 group">
                                                        <div>{fileTypeIcons[m.fileType]}</div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-semibold">{m.title}</h3>
                                                            <p className="text-sm text-muted-foreground break-words">
                                                                {m.filename} - Uploaded {formatDistanceToNow(m.uploadDate, { addSuffix: true })}
                                                            </p>
                                                        </div>
                                                        <DeleteButton
                                                            id={m.id}
                                                            deleteAction={deleteMaterial}
                                                            itemName={m.title}
                                                            itemType="Material"
                                                        />
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-muted-foreground p-4 text-center">No materials for this subject yet.</p>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                 </Card>
            </div>
        </div>
    );
}
