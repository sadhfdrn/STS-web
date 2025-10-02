// @ts-nocheck
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { NOTIFICATIONS, COURSE_MATERIALS, ASSIGNMENTS } from './mock-data';
import { format } from 'date-fns';

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

  // Simulate adding to database
  const newNotification = {
    id: (NOTIFICATIONS.length + 1).toString(),
    title,
    description,
    date: new Date().toISOString(),
  };

  NOTIFICATIONS.unshift(newNotification);

  // Revalidate paths to show new data
  revalidatePath('/admin/dashboard/notifications');
  revalidatePath('/notifications');
  revalidatePath('/');

  return { success: true, message: 'Notification added.' };
}


// --- Material Actions ---

const materialSchema = z.object({
    subject: z.enum(['Statistics', 'Physics', 'English', 'Mathematics', 'Computer Science']),
    filename: z.string().min(1, "File is required."),
});


export async function addMaterial(formData: FormData) {
    const file = formData.get('file') as File | null;
    const subject = formData.get('subject');

    if (!file || file.size === 0) {
        return { success: false, message: 'File is required.' };
    }
    
    // Simulate Catbox API upload and getting a URL back
    const mockFileUrl = `https://files.catbox.moe/mock_${file.name}`;
    
    // Determine file type
    let fileType: 'pdf' | 'image' | 'video' = 'pdf';
    if(file.type.startsWith('image/')) fileType = 'image';
    if(file.type.startsWith('video/')) fileType = 'video';

    // Simulate adding to database
    const newMaterial = {
        id: (COURSE_MATERIALS.length + 1).toString(),
        subject: subject as any,
        filename: file.name,
        file_url: mockFileUrl,
        file_type: fileType,
        upload_date: new Date().toISOString(),
    };

    COURSE_MATERIALS.unshift(newMaterial);

    revalidatePath('/admin/dashboard/materials');
    revalidatePath('/materials');

    return { success: true, message: 'Material uploaded successfully.'};
}


// --- Assignment Actions ---

const assignmentSchema = z.object({
    title: z.string().min(5),
    description: z.string().min(10),
    subject: z.enum(['Statistics', 'Physics', 'English', 'Mathematics', 'Computer Science']),
    deadline: z.date(),
    file: z.instanceof(File).refine(file => file.size > 0, "File is required.").refine(file => ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type), "Only PDF and image files are allowed."),
});

export async function addAssignment(formData: FormData) {
    const rawFormData = {
        title: formData.get('title'),
        description: formData.get('description'),
        subject: formData.get('subject'),
        deadline: new Date(formData.get('deadline') as string),
        file: formData.get('file'),
    };
    
    const validatedFields = assignmentSchema.safeParse(rawFormData);
    
    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);
        return {
          success: false,
          message: 'Invalid data. Please check all fields.',
        };
    }

    const { title, description, subject, deadline, file } = validatedFields.data;

    // Simulate file upload
    const mockFileUrl = `https://files.catbox.moe/mock_assignment_${file.name}`;
    const fileType = file.type.startsWith('image/') ? 'image' : 'pdf';

    const newAssignment = {
        id: (ASSIGNMENTS.length + 1).toString(),
        title,
        description,
        subject,
        deadline: deadline.toISOString(),
        file_url: mockFileUrl,
        file_type: fileType,
        filename: file.name,
        date: new Date().toISOString(),
    };

    ASSIGNMENTS.unshift(newAssignment);
    
    // Also create a notification
    const newNotification = {
        id: (NOTIFICATIONS.length + 1).toString(),
        title: `New Assignment: ${title}`,
        description: `${description}. Deadline: ${format(deadline, 'PP')}. View details in the Assignments section.`,
        date: new Date().toISOString(),
    };
    NOTIFICATIONS.unshift(newNotification);

    revalidatePath('/admin/dashboard/assignments');
    revalidatePath('/assignments');
    revalidatePath('/admin/dashboard/notifications');
    revalidatePath('/notifications');
    revalidatePath('/');

    return { success: true, message: 'Assignment created successfully.' };
}
