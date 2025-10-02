import { getAssignments } from '@/lib/mock-data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { PaginationControls } from '@/components/shared/pagination';
import { format, formatDistanceToNow } from 'date-fns';
import type { Assignment } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Download, FileText, Image, BookCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const fileTypeIcons = {
  pdf: <FileText className="h-6 w-6 text-destructive" />,
  image: <Image className="h-6 w-6 text-blue-500" />,
};


export default function AssignmentsPage({ searchParams }: { searchParams?: { page?: string } }) {
  const currentPage = Number(searchParams?.page) || 1;
  const { data: assignments, totalPages } = getAssignments({ page: currentPage, limit: 5 });

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold">All Assignments</h1>
      {assignments.length > 0 ? (
        <div className="space-y-4">
          {assignments.map((assignment: Assignment) => (
            <Card key={assignment.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                        <CardTitle className="font-headline">{assignment.title}</CardTitle>
                        <CardDescription>
                            Posted {format(new Date(assignment.date), 'MMMM d, yyyy')}
                        </CardDescription>
                    </div>
                    <Badge variant="secondary" className="self-start">{assignment.subject}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{assignment.description}</p>
                <p className="font-semibold text-sm">
                    Deadline: {format(new Date(assignment.deadline), 'PPpp')} 
                    <span className="text-muted-foreground"> ({formatDistanceToNow(new Date(assignment.deadline), { addSuffix: true })})</span>
                </p>
              </CardContent>
              <CardFooter className="bg-muted/50 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className='flex items-center gap-4 w-full sm:w-auto'>
                    {fileTypeIcons[assignment.file_type]}
                    <span className='font-medium truncate'>{assignment.filename}</span>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button asChild size="sm" className="flex-1 sm:flex-none">
                        <a href={assignment.file_url} target="_blank" rel="noopener noreferrer">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                        </a>
                    </Button>
                    {assignment.answer_file_url && (
                        <Button asChild size="sm" variant="secondary" className="flex-1 sm:flex-none">
                            <Link href={`/assignments/${assignment.id}/answer`}>
                                <BookCheck className="mr-2 h-4 w-4" />
                                View Answer
                            </Link>
                        </Button>
                    )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p>No assignments found.</p>
      )}
      {totalPages > 1 && <PaginationControls totalPages={totalPages} />}
    </div>
  );
}
