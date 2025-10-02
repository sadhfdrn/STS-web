import { getAssignmentById } from '@/lib/mock-data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileWarning, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AssignmentAnswerPage({ params }: { params: { id: string } }) {
  const assignment = getAssignmentById(params.id);

  if (!assignment) {
    return (
      <Alert variant="destructive">
        <FileWarning className="h-4 w-4" />
        <AlertTitle>Not Found</AlertTitle>
        <AlertDescription>The assignment you are looking for does not exist.</AlertDescription>
      </Alert>
    );
  }

  if (!assignment.answer_file_url) {
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
      <h1 className="font-headline text-3xl font-bold">Answer for: {assignment.title}</h1>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">{assignment.answer_filename}</CardTitle>
        </CardHeader>
        <CardContent>
          {assignment.answer_file_type === 'image' ? (
            // In a real app, you would use next/image. For mock data, a simple img is fine.
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={assignment.answer_file_url} 
              alt={`Answer for ${assignment.title}`} 
              className="rounded-lg border w-full h-auto"
            />
          ) : (
            <div className='flex flex-col items-center justify-center text-center bg-muted/50 p-8 rounded-lg border-2 border-dashed'>
                <p className='text-lg font-medium mb-4'>This is a PDF file.</p>
                <Button asChild>
                    <a href={assignment.answer_file_url} target="_blank" rel="noopener noreferrer">
                        View PDF
                    </a>
                </Button>
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
