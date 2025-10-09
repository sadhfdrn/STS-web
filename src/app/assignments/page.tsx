'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { PaginationControls } from '@/components/shared/pagination';
import { format, formatDistanceToNow } from 'date-fns';
import type { Assignment } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Download, FileText, Image, BookCheck, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { markAssignmentAsSubmitted, getAllAssignments } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useSession } from '@/components/session-provider';
import { useSearchParams } from 'next/navigation';
import { AssignmentCardSkeleton } from '@/components/shared/loading-skeletons';

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
    return <Button onClick={handleClick} size="sm" variant="outline" className="w-full sm:w-auto">Mark as Submitted</Button>;
}

export default function AssignmentsPage() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const levelFilter = searchParams.get('level');
  const session = useSession();
  
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAssignments() {
      setIsLoading(true);
      const allAssignments = await getAllAssignments();
      let filtered = allAssignments;
      
      if (levelFilter) {
        filtered = filtered.filter(a => a.level === levelFilter);
      }
      
      const sorted = filtered.sort((a,b) => b.date.getTime() - a.date.getTime());
      const pages = Math.ceil(sorted.length / PAGE_SIZE);
      const start = (currentPage - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      
      setAssignments(sorted.slice(start, end));
      setTotalPages(pages);
      setIsLoading(false);
    }
    loadAssignments();
  }, [currentPage, levelFilter]);


  const fileTypeIcons = {
    pdf: <FileText className="h-6 w-6 text-destructive" />,
    image: <Image className="h-6 w-6 text-blue-500" />,
  };

  return (
    <div className="space-y-6 max-w-full">
      <h1 className="font-headline text-2xl sm:text-3xl font-bold animate-in">
        All Assignments
      </h1>
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <AssignmentCardSkeleton key={i} />
          ))}
        </div>
      ) : assignments && assignments.length > 0 ? (
          <div className="space-y-4">
          {assignments.map((assignment: Assignment) => (
              <div key={assignment.id} className="animate-in">
              <Card className="overflow-hidden max-w-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
              <CardHeader className="pb-3 sm:pb-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div className="flex-1 min-w-0">
                          <CardTitle className="font-headline text-lg sm:text-xl">{assignment.title}</CardTitle>
                          <CardDescription className="text-xs sm:text-sm">
                              {format(assignment.date, 'MMM d, yyyy')}
                          </CardDescription>
                      </div>
                      <Badge variant="secondary" className="self-start shrink-0 text-xs">{assignment.subject}</Badge>
                  </div>
              </CardHeader>
              <CardContent className="pb-3 sm:pb-6">
                  <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">{assignment.description}</p>
                  <div className="space-y-2">
                      <p className="font-semibold text-xs sm:text-sm">
                          <span className="block sm:inline">Deadline: {format(assignment.deadline, 'MMM d, yyyy h:mm a')}</span>
                          <span className="text-muted-foreground block sm:inline sm:ml-1">({formatDistanceToNow(assignment.deadline, { addSuffix: true })})</span>
                      </p>
                      {assignment.submitted && assignment.submissionDate && (
                          <div className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-2 shrink-0" />
                              <span className="text-xs sm:text-sm font-medium">Submitted {format(assignment.submissionDate, 'MMM d, yyyy')}</span>
                          </div>
                      )}
                  </div>
              </CardContent>
              <CardFooter className="bg-muted/50 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 max-w-full">
                  <div className='flex items-center gap-2 sm:gap-4 min-w-0 flex-1 max-w-full overflow-hidden'>
                      <div className="shrink-0">{fileTypeIcons[assignment.fileType]}</div>
                      <span className='font-medium text-sm sm:text-base overflow-hidden break-words'>{assignment.filename}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
                      <Button asChild size="sm" className="w-full sm:w-auto">
                          <a href={`/api/download-assignment/${assignment.id}`} download>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                          </a>
                      </Button>
                      {assignment.answerFileUrl && (
                          <Button asChild size="sm" variant="secondary" className="w-full sm:w-auto">
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
              </div>
          ))}
          </div>
      ) : (
          <p>No assignments found.</p>
      )}
      {totalPages > 1 && <PaginationControls totalPages={totalPages} />}
    </div>
  );
}
