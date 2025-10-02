'use client';

import React from 'react';
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
import { addMaterial } from '@/lib/actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Subject } from '@/lib/types';
import { useRef } from 'react';

const subjects: Subject[] = ['Statistics', 'Physics', 'English', 'Mathematics', 'Computer Science'];
const subjectEnum: [Subject, ...Subject[]] = ['Statistics', 'Physics', 'English', 'Mathematics', 'Computer Science'];

const formSchema = z.object({
  subject: z.enum(subjectEnum),
  file: z.instanceof(File).refine(file => file.size > 0, "File is required."),
});

export function MaterialUploadForm() {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = React.useTransition();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        subject: 'Statistics'
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append('subject', values.subject);
    formData.append('file', values.file);

    startTransition(async () => {
      const result = await addMaterial(formData);
      if(result.success) {
          toast({ title: "Success", description: "Material uploaded successfully."});
          form.reset();
          if (formRef.current) {
            formRef.current.reset();
            const fileInput = formRef.current.querySelector('input[type="file"]');
            if (fileInput) (fileInput as HTMLInputElement).value = '';
          }
      } else {
          toast({ variant: 'destructive', title: "Error", description: result.message });
      }
    });
  }

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field: { onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <Input 
                    {...fieldProps}
                    type="file" 
                    onChange={(e) => onChange(e.target.files?.[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            Upload Material
        </Button>
      </form>
    </Form>
  );
}
