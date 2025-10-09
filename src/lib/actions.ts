'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { format } from 'date-fns';
import fetch from 'node-fetch';
import { 
    addNotification as dbAddNotification, 
    addCourseMaterial as dbAddCourseMaterial, 
    addAssignment as dbAddAssignment, 
    updateAssignmentSubmission,
    updateNotificationSubmission,
    deleteNotification as dbDeleteNotification,
    deleteAssignment as dbDeleteAssignment,
    deleteCourseMaterial as dbDeleteMaterial,
    getSubjects as dbGetSubjects,
    addSubject as dbAddSubject,
    deleteSubject as dbDeleteSubject,
    pool,
    getCourseMaterialById as dbGetCourseMaterialById,
    getAssignmentById as dbGetAssignmentById,
    saveFcmToken as dbSaveFcmToken,
    getAllFcmTokens
} from './db';
import type { Notification, Assignment, CourseMaterial, Subject } from './types';
import { sendPushNotification } from './firebase-admin';

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
  eventDate: z.string().nullable().optional(),
  level: z.string().min(1),
});

export async function addNotification(formData: FormData) {
  const data = {
    title: formData.get('title'),
    description: formData.get('description'),
    eventDate: formData.get('eventDate'),
    level: formData.get('level'),
  };
  
  console.log('Received form data:', data);
  
  const validatedFields = notificationSchema.safeParse(data);

  if (!validatedFields.success) {
    console.error('Validation failed:', validatedFields.error.flatten().fieldErrors);
    return {
      success: false,
      message: 'Invalid data. Title and description are required.',
    };
  }
  
  const { title, description, eventDate, level } = validatedFields.data;
  
  const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      title,
      description,
      date: new Date(),
      eventDate: eventDate ? new Date(eventDate) : undefined,
      submitted: false,
      level,
  };

  await dbAddNotification(newNotification);

  try {
    const tokens = await getAllFcmTokens();
    if (tokens.length > 0) {
      await sendPushNotification(title, description, tokens);
    }
  } catch (error) {
    console.error('Error sending push notification:', error);
  }

  revalidatePath('/admin/dashboard/notifications');
  revalidatePath('/notifications');
  revalidatePath('/');

  return { success: true, message: 'Notification added.' };
}

export async function deleteNotification(id: string) {
    await dbDeleteNotification(id);
    revalidatePath('/admin/dashboard/notifications');
    revalidatePath('/notifications');
    revalidatePath('/');
    return { success: true, message: 'Notification deleted.' };
}


// --- Material Actions ---

const materialSchema = z.object({
    title: z.string().min(3, 'Title is required.'),
    subject: z.string().min(1, 'Subject is required.'),
    file: z.instanceof(File).refine(file => file.size > 0, "File is required."),
    level: z.string().min(1, 'Level is required.'),
});

export async function addMaterial(formData: FormData) {
    const rawFormData = {
        title: formData.get('title'),
        subject: formData.get('subject'),
        file: formData.get('file'),
        level: formData.get('level'),
    };

    const validatedFields = materialSchema.safeParse(rawFormData);
    
    if (!validatedFields.success) {
        return {
          success: false,
          message: 'Invalid data. Title, subject and file are required.',
        };
    }

    const { title, subject, file, level } = validatedFields.data;

    const fileUrl = await uploadToCatbox(file);

    if (!fileUrl) {
        return { success: false, message: 'File upload failed. Please try again.' };
    }
    
    let fileType: 'pdf' | 'image' | 'video' = 'pdf';
    if(file.type.startsWith('image/')) fileType = 'image';
    if(file.type.startsWith('video/')) fileType = 'video';
    
    const newMaterial: CourseMaterial = {
        id: `mat-${Date.now()}`,
        title,
        subject: subject as string,
        filename: file.name,
        fileUrl: fileUrl,
        fileType: fileType,
        uploadDate: new Date(),
        level,
    };

    await dbAddCourseMaterial(newMaterial);

    revalidatePath('/admin/dashboard/materials');
    revalidatePath('/materials');

    return { success: true, message: 'Material uploaded successfully.'};
}

export async function deleteMaterial(id: string) {
    await dbDeleteMaterial(id);
    revalidatePath('/admin/dashboard/materials');
    revalidatePath('/materials');
    return { success: true, message: 'Material deleted.' };
}


// --- Assignment Actions ---

const assignmentSchema = z.object({
    title: z.string().min(5),
    description: z.string().min(10),
    subject: z.string().min(1, 'Subject is required'),
    deadline: z.date(),
    file: z.instanceof(File).refine(file => file.size > 0, "File is required.").refine(file => ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type), "Only PDF and image files are allowed."),
    answerFile: z.instanceof(File).nullish(),
    level: z.string().min(1, 'Level is required'),
});

export async function addAssignment(formData: FormData) {
    const rawFormData = {
        title: formData.get('title'),
        description: formData.get('description'),
        subject: formData.get('subject'),
        deadline: new Date(formData.get('deadline') as string),
        file: formData.get('file'),
        answerFile: formData.get('answerFile'),
        level: formData.get('level'),
    };
    
    const validatedFields = assignmentSchema.safeParse(rawFormData);
    
    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);
        return {
          success: false,
          message: 'Invalid data. Please check all fields.',
        };
    }

    const { title, description, subject, deadline, file, answerFile, level } = validatedFields.data;

    const fileUrl = await uploadToCatbox(file);
    if (!fileUrl) {
        return { success: false, message: 'Assignment file upload failed. Please try again.' };
    }
    const fileType = file.type.startsWith('image/') ? 'image' : 'pdf';
    
    let answerFileUrl: string | null = null;
    let answerFileType: 'pdf' | 'image' | null = null;
    let answerFilename: string | null = null;
    
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
        submitted: false,
        level,
    };

    await dbAddNotification(newNotification);

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
        notificationId: notificationId,
        level,
    };

    await dbAddAssignment(newAssignment);

    try {
      const tokens = await getAllFcmTokens();
      if (tokens.length > 0) {
        await sendPushNotification(
          `New Assignment: ${title}`,
          `${description}. Deadline: ${format(deadline, 'PP')}`,
          tokens
        );
      }
    } catch (error) {
      console.error('Error sending push notification:', error);
    }

    revalidatePath('/admin/dashboard/assignments');
    revalidatePath('/assignments');
    revalidatePath('/admin/dashboard/notifications');
    revalidatePath('/notifications');
    revalidatePath('/');

    return { success: true, message: 'Assignment created successfully.' };
}

export async function deleteAssignment(id: string) {
    const assignment = await getAssignmentById(id);
    if (assignment?.notificationId) {
        await dbDeleteNotification(assignment.notificationId);
    }
    await dbDeleteAssignment(id);
    revalidatePath('/admin/dashboard/assignments');
    revalidatePath('/assignments');
    revalidatePath('/admin/dashboard/notifications');
    revalidatePath('/notifications');
    revalidatePath('/');
    return { success: true, message: 'Assignment deleted.' };
}

export async function markAssignmentAsSubmitted(assignmentId: string, notificationId: string) {
    await updateAssignmentSubmission(assignmentId);
    await updateNotificationSubmission(notificationId);

    revalidatePath('/assignments');
    revalidatePath('/');

    return { success: true, message: 'Assignment marked as submitted.' };
}

export async function uploadAnswerFile(formData: FormData) {
    const assignmentId = formData.get('assignmentId') as string;
    const answerFile = formData.get('answerFile') as File;

    if (!answerFile || answerFile.size === 0) {
        return { success: false, message: 'No file selected.' };
    }

    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(answerFile.type)) {
        return { success: false, message: 'Only PDF and image files are allowed.' };
    }

    const answerFileUrl = await uploadToCatbox(answerFile);
    if (!answerFileUrl) {
        return { success: false, message: 'File upload failed. Please try again.' };
    }

    const answerFileType = answerFile.type.startsWith('image/') ? 'image' : 'pdf';
    const answerFilename = answerFile.name;

    const { updateAssignmentAnswer } = await import('./db');
    await updateAssignmentAnswer(assignmentId, answerFileUrl, answerFileType, answerFilename);

    revalidatePath('/admin/dashboard/assignments');
    revalidatePath('/assignments');

    return { success: true, message: 'Answer file uploaded successfully.' };
}

export async function getAllNotifications(level?: string) {
    const { getNotifications } = await import('./db');
    return await getNotifications(level);
}

export async function getAllCourseMaterials(level?: string) {
    const { getCourseMaterials } = await import('./db');
    return await getCourseMaterials(level);
}

export async function getCourseMaterialById(id: string) {
    return await dbGetCourseMaterialById(id);
}

export async function getAllAssignments(level?: string) {
    const { getAssignments } = await import('./db');
    return await getAssignments(level);
}

export async function getAssignmentById(id: string) {
    return await dbGetAssignmentById(id);
}

// --- Subject Actions ---
export async function getSubjects() {
    return await dbGetSubjects();
}

export async function addSubject(name: string) {
    const existingSubject = await pool.query('SELECT * FROM subjects WHERE name = $1', [name]);
    if (existingSubject.rows.length > 0) {
        return { success: false, message: 'Subject already exists.' };
    }
    
    await dbAddSubject({ id: name.toLowerCase().replace(/\s+/g, '-'), name });
    revalidatePath('/admin/dashboard/subjects');
    revalidatePath('/admin/dashboard/materials');
    revalidatePath('/admin/dashboard/assignments');
    return { success: true, message: 'Subject added.' };
}

export async function deleteSubject(id: string) {
    const subjectNameResult = await pool.query('SELECT name FROM subjects WHERE id = $1', [id]);
    if (subjectNameResult.rows.length === 0) {
        return { success: false, message: 'Subject not found.' };
    }
    const subjectName = subjectNameResult.rows[0].name;

    const materials = await pool.query('SELECT 1 FROM course_materials WHERE subject = $1', [subjectName]);
    const assignments = await pool.query('SELECT 1 FROM assignments WHERE subject = $1', [subjectName]);

    if (materials.rows.length > 0 || assignments.rows.length > 0) {
        return { success: false, message: 'Cannot delete subject as it is currently in use by materials or assignments.' };
    }

    await dbDeleteSubject(id);
    revalidatePath('/admin/dashboard/subjects');
    revalidatePath('/admin/dashboard/materials');
    revalidatePath('/admin/dashboard/assignments');
    return { success: true, message: 'Subject deleted.' };
}

// --- FCM Token Actions ---
export async function saveFcmToken(token: string) {
  await dbSaveFcmToken(token);
  return { success: true };
}
