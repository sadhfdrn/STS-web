'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { PaginationControls } from '@/components/shared/pagination';
import { format, formatDistanceToNow } from 'date-fns';
import type { Assignment } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Download, FileText, Image, BookCheck, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { assignments as allAssignments } from '@/lib/mock-data';
import { useState, useEffect } from 'react';
import { markAssignmentAsSubmitted } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useSession } from '@/components/session-provider';
import { useSearchParams } from 'next/navigation';

const PAGE_SIZE = 5;

function MarkAsSubmittedButton({ assignmentId, notificationId }: { assignmentId: string, notificationId: string }) {
    const { toast } = useToast();
    const handleClick = async () => {
        const result = await markAssignmentAsSubmitted(assignmentId, notificationId);
        if (result.success) {
            toast({ title: "Success", description: "Assignment marked as submitted."});
        } else {
            toast({ variant: 'destructive', title: "Error", description: result.message });
        }
    };
    return <Button onClick={handleClick} size="sm" variant="outline">Mark as Submitted</Button>;
}

export default function AssignmentsPage() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const session = useSession();
  
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const sorted = allAssignments.sort((a,b) => b.date.getTime() - a.date.getTime());
    const pages = Math.ceil(sorted.length / PAGE_SIZE);
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    
    setAssignments(sorted.slice(start, end));
    setTotalPages(pages);
  }, [currentPage]);


  const fileTypeIcons = {
    pdf: <FileText className="h-6 w-6 text-destructive" />,
    image: <Image className="h-6 w-6 text-blue-500" />,
  };

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold">All Assignments</h1>
      {assignments && assignments.length > 0 ? (
          <div className="space-y-4">
          {assignments.map((assignment: Assignment) => (
              <Card key={assignment.id}>
              <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div>
                          <CardTitle className="font-headline">{assignment.title}</CardTitle>
                          <CardDescription>
                              Posted {format(assignment.date, 'MMMM d, yyyy')}
                          </CardDescription>
                      </div>
                      <Badge variant="secondary" className="self-start">{assignment.subject}</Badge>
                  </div>
              </CardHeader>
              <CardContent>
                  <p className="text-muted-foreground mb-4">{assignment.description}</p>
                  <p className="font-semibold text-sm">
                      Deadline: {format(assignment.deadline, 'PPpp')} 
                      <span className="text-muted-foreground"> ({formatDistanceToNow(assignment.deadline, { addSuffix: true })})</span>
                  </p>
                  {assignment.submitted && assignment.submissionDate && (
                      <div className="mt-2 flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          <span className="text-sm font-medium">Submitted on {format(assignment.submissionDate, 'PP')}</span>
                      </div>
                  )}
              </CardContent>
              <CardFooter className="bg-muted/50 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className='flex items-center gap-4 w-full sm:w-auto'>
                      {fileTypeIcons[assignment.fileType]}
                      <span className='font-medium truncate'>{assignment.filename}</span>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                      <Button asChild size="sm" className="flex-1 sm:flex-none">
                          <a href={assignment.fileUrl} target="_blank" rel="noopener noreferrer">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                          </a>
                      </Button>
                      {assignment.answerFileUrl && (
                          <Button asChild size="sm" variant="secondary" className="flex-1 sm:flex-none">
                              <Link href={`/assignments/${assignment.id}/answer`}>
                                  <BookCheck className="mr-2 h-4 w-4" />
                                  View Answer
                              </Link>
                          </Button>
                      )}
                      {session?.email && !assignment.submitted && assignment.notificationId && (
                          <MarkAsSubmittedButton assignmentId={assignment.id} notificationId={assignment.notificationId} />
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
