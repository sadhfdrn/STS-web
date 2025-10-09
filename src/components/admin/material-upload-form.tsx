'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';
import { addMaterial, getSubjects } from '@/lib/actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Subject } from '@/lib/types';
import { Progress } from '@/components/ui/progress';


const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  subject: z.string().min(1, 'Subject is required'),
  file: z.instanceof(File).refine(file => file.size > 0, "File is required."),
  level: z.string().min(1, 'Level is required'),
});

export function MaterialUploadForm() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = React.useTransition();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [progress, setProgress] = React.useState(0);

  useEffect(() => {
    async function fetchSubjects() {
      const fetchedSubjects = await getSubjects();
      setSubjects(fetchedSubjects);
    }
    fetchSubjects();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPending) {
        setProgress(10);
        timer = setInterval(() => {
            setProgress(prev => (prev < 90 ? prev + 10 : 90));
        }, 500);
    } else {
        setProgress(0);
    }
    return () => clearInterval(timer);
  }, [isPending]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        title: '',
        subject: '',
        file: undefined,
        level: '100',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('subject', values.subject);
    formData.append('file', values.file);
    formData.append('level', values.level);

    startTransition(async () => {
      const result = await addMaterial(formData);
      if(result.success) {
          setProgress(100);
          toast({ title: "Success", description: "Material uploaded successfully."});
          form.reset();
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
      } else {
          toast({ variant: 'destructive', title: "Error", description: result.message });
          setProgress(0);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Material Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Lecture 1: Intro to Stats" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subjects.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field: { onChange, value, ref, ...rest } }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <Input 
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        onChange(file);
                    }}
                    {...rest}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="100">100 Level</SelectItem>
                  <SelectItem value="200">200 Level</SelectItem>
                  <SelectItem value="300">300 Level</SelectItem>
                  <SelectItem value="400">400 Level</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {isPending && <Progress value={progress} className="w-full" />}
        <Button type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            Upload Material
        </Button>
      </form>
    </Form>
  );
}
