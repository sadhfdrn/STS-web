import { MaterialUploadForm } from "@/components/admin/material-upload-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getMaterials } from "@/lib/mock-data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Subject } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { FileText, Image, Video } from "lucide-react";

const fileTypeIcons = {
  pdf: <FileText className="h-5 w-5 text-muted-foreground" />,
  image: <Image className="h-5 w-5 text-muted-foreground" />,
  video: <Video className="h-5 w-5 text-muted-foreground" />,
};

const subjects: Subject[] = ['Statistics', 'Physics', 'English', 'Mathematics', 'Computer Science'];

export default function AdminMaterialsPage() {
    const { data: allMaterials } = getMaterials({ page: 1, limit: 100 });
    
    const materialsBySubject = subjects.reduce((acc, subject) => {
        acc[subject] = allMaterials.filter(m => m.subject === subject);
        return acc;
    }, {} as Record<Subject, typeof allMaterials>);

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
                                <AccordionItem value={subject} key={subject}>
                                    <AccordionTrigger className="font-headline">{subject} ({materialsBySubject[subject].length})</AccordionTrigger>
                                    <AccordionContent>
                                        {materialsBySubject[subject].length > 0 ? (
                                            <ul className="divide-y">
                                                {materialsBySubject[subject].map(m => (
                                                    <li key={m.id} className="p-4 flex items-center space-x-4">
                                                        <div>{fileTypeIcons[m.file_type]}</div>
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold">{m.filename}</h3>
                                                            <p className="text-sm text-muted-foreground">
                                                                Uploaded {formatDistanceToNow(new Date(m.upload_date), { addSuffix: true })}
                                                            </p>
                                                        </div>
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
