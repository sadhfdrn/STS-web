import { getAssignments } from '@/lib/mock-data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { PaginationControls } from '@/components/shared/pagination';
import { format, formatDistanceToNow } from 'date-fns';
import type { Assignment } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Download, FileText, Image } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline">{assignment.title}</CardTitle>
                        <CardDescription>
                            Posted {format(new Date(assignment.date), 'MMMM d, yyyy')}
                        </CardDescription>
                    </div>
                    <Badge variant="secondary">{assignment.subject}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{assignment.description}</p>
                <p className="font-semibold text-sm">
                    Deadline: {format(new Date(assignment.deadline), 'PPpp')} 
                    <span className="text-muted-foreground"> ({formatDistanceToNow(new Date(assignment.deadline), { addSuffix: true })})</span>
                </p>
              </CardContent>
              <CardFooter className='gap-4'>
                {fileTypeIcons[assignment.file_type]}
                <span className='font-medium'>{assignment.filename}</span>
                <Button asChild className="ml-auto">
                    <a href={assignment.file_url} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                    </a>
                </Button>
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
