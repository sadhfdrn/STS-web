// @ts-nocheck
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { NOTIFICATIONS, COURSE_MATERIALS } from './mock-data';

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
