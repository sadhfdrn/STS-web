'use client';

import * as React from 'react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, FileCheck } from 'lucide-react';
import { uploadAnswerFile } from '@/lib/actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

interface UploadAnswerButtonProps {
  assignmentId: string;
  assignmentTitle: string;
  hasAnswer: boolean;
}

export function UploadAnswerButton({ assignmentId, assignmentTitle, hasAnswer }: UploadAnswerButtonProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = React.useTransition();
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please select a file first.' });
      return;
    }

    const formData = new FormData();
    formData.append('assignmentId', assignmentId);
    formData.append('answerFile', selectedFile);

    startTransition(async () => {
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await uploadAnswerFile(formData);
      clearInterval(interval);
      setUploadProgress(100);

      if (result.success) {
        toast({ title: 'Success', description: result.message });
        setOpen(false);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setTimeout(() => setUploadProgress(0), 1000);
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.message });
        setUploadProgress(0);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={hasAnswer ? 'outline' : 'default'}
          size="sm"
          className="h-8 text-xs"
        >
          {hasAnswer ? (
            <>
              <FileCheck className="mr-1 h-3 w-3" />
              Update Answer
            </>
          ) : (
            <>
              <Upload className="mr-1 h-3 w-3" />
              Upload Answer
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{hasAnswer ? 'Update' : 'Upload'} Answer File</DialogTitle>
          <DialogDescription>
            {hasAnswer ? 'Replace the' : 'Upload an'} answer file for "{assignmentTitle}"
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="answer-file">Answer File (PDF or Image)</Label>
            <Input
              id="answer-file"
              type="file"
              accept="application/pdf,image/jpeg,image/png"
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={isPending}
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>
          {isPending && uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={isPending || !selectedFile}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
