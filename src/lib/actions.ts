'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { format } from 'date-fns';
import fetch from 'node-fetch';
import { notifications, assignments, courseMaterials, addData } from './mock-data';
import type { Notification, Assignment, CourseMaterial, Subject } from './types';

async function uploadToCatbox(file: File) {
    if (!file || file.size === 0) return null;

    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('fileToUpload', file);

    try {
        const response = await fetch('https://catbox.moe/user/api.php', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            console.error('Catbox API Error:', await response.text());
            return null;
        }

        return await response.text();
    } catch (error) {
        console.error('Failed to upload file:', error);
        return null;
    }
}


// --- Notification Actions ---

const notificationSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
});

export async function addNotification(formData: FormData) {
  const validatedFields = notificationSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid data. Title and description are required.',
    };
  }
  
  const { title, description } = validatedFields.data;
  
  const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      title,
      description,
      date: new Date(),
      submitted: false,
  };

  addData('notifications', newNotification);

  revalidatePath('/admin/dashboard/notifications');
  revalidatePath('/notifications');
  revalidatePath('/');

  return { success: true, message: 'Notification added.' };
}


// --- Material Actions ---
const subjectEnum: [Subject, ...Subject[]] = ['Statistics', 'Physics', 'English', 'Mathematics', 'Computer Science'];

const materialSchema = z.object({
    subject: z.enum(subjectEnum),
});


export async function addMaterial(formData: FormData) {
    const file = formData.get('file') as File | null;
    const subject = formData.get('subject');
    
    if (!file || file.size === 0) {
        return { success: false, message: 'File is required.' };
    }

    const fileUrl = await uploadToCatbox(file);

    if (!fileUrl) {
        return { success: false, message: 'File upload failed. Please try again.' };
    }
    
    let fileType: 'pdf' | 'image' | 'video' = 'pdf';
    if(file.type.startsWith('image/')) fileType = 'image';
    if(file.type.startsWith('video/')) fileType = 'video';
    
    const newMaterial: CourseMaterial = {
        id: `mat-${Date.now()}`,
        subject: subject as Subject,
        filename: file.name,
        fileUrl: fileUrl,
        fileType: fileType,
        uploadDate: new Date(),
    };

    addData('courseMaterials', newMaterial);

    revalidatePath('/admin/dashboard/materials');
    revalidatePath('/materials');

    return { success: true, message: 'Material uploaded successfully.'};
}


// --- Assignment Actions ---

const assignmentSchema = z.object({
    title: z.string().min(5),
    description: z.string().min(10),
    subject: z.enum(subjectEnum),
    deadline: z.date(),
    file: z.instanceof(File).refine(file => file.size > 0, "File is required.").refine(file => ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type), "Only PDF and image files are allowed."),
    answerFile: z.instanceof(File).optional(),
});

export async function addAssignment(formData: FormData) {
    const rawFormData = {
        title: formData.get('title'),
        description: formData.get('description'),
        subject: formData.get('subject'),
        deadline: new Date(formData.get('deadline') as string),
        file: formData.get('file'),
        answerFile: formData.get('answerFile'),
    };
    
    const validatedFields = assignmentSchema.safeParse(rawFormData);
    
    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);
        return {
          success: false,
          message: 'Invalid data. Please check all fields.',
        };
    }

    const { title, description, subject, deadline, file, answerFile } = validatedFields.data;

    const fileUrl = await uploadToCatbox(file);
    if (!fileUrl) {
        return { success: false, message: 'Assignment file upload failed. Please try again.' };
    }
    const fileType = file.type.startsWith('image/') ? 'image' : 'pdf';
    
    let answerFileUrl = null;
    let answerFileType = null;
    let answerFilename = null;
    
    if (answerFile && answerFile.size > 0) {
        answerFileUrl = await uploadToCatbox(answerFile);
        if (answerFileUrl) {
            answerFileType = answerFile.type.startsWith('image/') ? 'image' : 'pdf';
            answerFilename = answerFile.name;
        }
    }
    const notificationId = `notif-${Date.now()}`;
    const newNotification: Notification = {
        id: notificationId,
        title: `New Assignment: ${title}`,
        description: `${description}. Deadline: ${format(deadline, 'PP')}. View details in the Assignments section.`,
        date: new Date(),
        submitted: false
    };

    addData('notifications', newNotification);

    const newAssignment: Assignment = {
        id: `asg-${Date.now()}`,
        title,
        description,
        subject,
        deadline,
        fileUrl: fileUrl,
        fileType: fileType,
        filename: file.name,
        date: new Date(),
        answerFileUrl,
        answerFileType,
        answerFilename,
        submitted: false,
        notificationId: notificationId
    };

    addData('assignments', newAssignment);

    revalidatePath('/admin/dashboard/assignments');
    revalidatePath('/assignments');
    revalidatePath('/admin/dashboard/notifications');
    revalidatePath('/notifications');
    revalidatePath('/');

    return { success: true, message: 'Assignment created successfully.' };
}

export async function markAssignmentAsSubmitted(assignmentId: string, notificationId: string) {
    const assignment = assignments.find(a => a.id === assignmentId);
    const notification = notifications.find(n => n.id === notificationId);

    if (assignment) {
        assignment.submitted = true;
        assignment.submissionDate = new Date();
    }
    if(notification) {
        notification.submitted = true;
        notification.submissionDate = new Date();
    }

    if (!assignment) {
      return { success: false, message: 'Assignment not found.' };
    }

    revalidatePath('/assignments');
    revalidatePath('/');

    return { success: true, message: 'Assignment marked as submitted.' };
}
