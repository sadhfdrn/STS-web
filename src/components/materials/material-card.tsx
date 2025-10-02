import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { CourseMaterial } from '@/lib/types';
import { FileText, Image, Video, Download } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Props {
  material: CourseMaterial;
}

const fileTypeIcons = {
  pdf: <FileText className="h-6 w-6 text-destructive" />,
  image: <Image className="h-6 w-6 text-blue-500" />,
  video: <Video className="h-6 w-6 text-purple-500" />,
};

export function MaterialCard({ material }: Props) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-start gap-4 space-y-0 pb-2">
        {fileTypeIcons[material.fileType]}
        <div className="flex-1">
          <CardTitle className="font-headline text-base leading-tight line-clamp-2">{material.filename}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 text-sm text-muted-foreground">
        <p><strong>Subject:</strong> {material.subject}</p>
        <p><strong>Uploaded:</strong> {formatDistanceToNow(material.uploadDate.toDate(), { addSuffix: true })}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <a href={material.fileUrl} target="_blank" rel="noopener noreferrer">
            <Download className="mr-2 h-4 w-4" />
            Download
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
