'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileWarning, Download } from 'lucide-react';
import type { Assignment } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { getAssignmentById } from '@/lib/actions';
import { useEffect, useState } from 'react';

export default function AssignmentAnswerPage({ params }: { params: { id: string } }) {
  const [assignment, setAssignment] = useState<Assignment | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAssignment() {
      const found = await getAssignmentById(params.id);
      setAssignment(found);
      setIsLoading(false);
    }
    loadAssignment();
  }, [params.id]);


  if (isLoading) {
      return <p>Loading answer...</p>
  }

  if (!assignment) {
    return (
      <Alert variant="destructive">
        <FileWarning className="h-4 w-4" />
        <AlertTitle>Not Found</AlertTitle>
        <AlertDescription>The assignment you are looking for does not exist.</AlertDescription>
      </Alert>
    );
  }

  if (!assignment.answerFileUrl) {
    return (
      <Alert>
        <FileWarning className="h-4 w-4" />
        <AlertTitle>No Answer Available</AlertTitle>
        <AlertDescription>The answer for this assignment has not been uploaded yet. Please check back later.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-headline text-3xl font-bold">Answer for: {assignment.title}</h1>
        <Button asChild>
          <a href={`/api/download-answer/${assignment.id}`} download>
            <Download className="mr-2 h-4 w-4" />
            Download Answer
          </a>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">{assignment.answerFilename}</CardTitle>
        </CardHeader>
        <CardContent>
          {assignment.answerFileType === 'image' ? (
            <img 
              src={assignment.answerFileUrl} 
              alt={`Answer for ${assignment.title}`} 
              className="rounded-lg border w-full h-auto"
            />
          ) : (
            <div className='flex flex-col items-center justify-center text-center bg-muted/50 p-8 rounded-lg border-2 border-dashed'>
                <p className='text-lg font-medium mb-4'>This is a PDF file.</p>
                <div className="flex gap-2">
                  <Button asChild>
                    <a href={assignment.answerFileUrl} target="_blank" rel="noopener noreferrer">
                        View PDF
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href={`/api/download-answer/${assignment.id}`} download>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </a>
                  </Button>
                </div>
                <p className='text-sm text-muted-foreground mt-4'>
                    The preview for PDF files is not available in this mock version. Click the button to view the file.
                </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
