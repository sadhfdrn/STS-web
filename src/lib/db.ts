import { Pool } from 'pg';
import type { Notification, CourseMaterial, Assignment, Subject, FileType } from './types';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function getNotifications(): Promise<Notification[]> {
  const result = await pool.query(
    'SELECT * FROM notifications ORDER BY date DESC'
  );
  return result.rows.map(row => ({
    id: row.id,
    title: row.title,
    description: row.description,
    date: new Date(row.date),
    eventDate: row.event_date ? new Date(row.event_date) : undefined,
    submitted: row.submitted,
    submissionDate: row.submission_date ? new Date(row.submission_date) : undefined,
  }));
}

export async function addNotification(notification: Notification): Promise<void> {
  await pool.query(
    'INSERT INTO notifications (id, title, description, date, event_date, submitted, submission_date) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [notification.id, notification.title, notification.description, notification.date, notification.eventDate || null, notification.submitted || false, notification.submissionDate || null]
  );
}

export async function deleteNotification(id: string): Promise<void> {
    await pool.query('DELETE FROM notifications WHERE id = $1', [id]);
}

export async function getCourseMaterials(): Promise<CourseMaterial[]> {
  const result = await pool.query(
    'SELECT * FROM course_materials ORDER BY upload_date DESC'
  );
  return result.rows.map(row => ({
    id: row.id,
    title: row.title,
    subject: row.subject,
    filename: row.filename,
    fileUrl: row.file_url,
    fileType: row.file_type,
    uploadDate: new Date(row.upload_date),
  }));
}

export async function getCourseMaterialById(id: string): Promise<CourseMaterial | undefined> {
    const result = await pool.query('SELECT * FROM course_materials WHERE id = $1', [id]);
    if (result.rows.length === 0) return undefined;
    const row = result.rows[0];
    return {
        id: row.id,
        title: row.title,
        subject: row.subject,
        filename: row.filename,
        fileUrl: row.file_url,
        fileType: row.file_type as FileType,
        uploadDate: new Date(row.upload_date),
    };
}

export async function addCourseMaterial(material: CourseMaterial): Promise<void> {
  await pool.query(
    'INSERT INTO course_materials (id, title, subject, filename, file_url, file_type, upload_date) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [material.id, material.title, material.subject, material.filename, material.fileUrl, material.fileType, material.uploadDate]
  );
}

export async function deleteCourseMaterial(id: string): Promise<void> {
    await pool.query('DELETE FROM course_materials WHERE id = $1', [id]);
}

export async function getAssignments(): Promise<Assignment[]> {
  const result = await pool.query(
    'SELECT * FROM assignments ORDER BY date DESC'
  );
  return result.rows.map(row => ({
    id: row.id,
    title: row.title,
    description: row.description,
    subject: row.subject,
    deadline: new Date(row.deadline),
    fileUrl: row.file_url,
    fileType: row.file_type as 'pdf' | 'image',
    filename: row.filename,
    date: new Date(row.date),
    answerFileUrl: row.answer_file_url || null,
    answerFileType: (row.answer_file_type as 'pdf' | 'image') || null,
    answerFilename: row.answer_filename || null,
    submitted: row.submitted,
    submissionDate: row.submission_date ? new Date(row.submission_date) : undefined,
    notificationId: row.notification_id,
  }));
}

export async function getAssignmentById(id: string): Promise<Assignment | undefined> {
    const result = await pool.query('SELECT * FROM assignments WHERE id = $1', [id]);
    if (result.rows.length === 0) return undefined;
    const row = result.rows[0];
    return {
        id: row.id,
        title: row.title,
        description: row.description,
        subject: row.subject,
        deadline: new Date(row.deadline),
        fileUrl: row.file_url,
        fileType: row.file_type as 'pdf' | 'image',
        filename: row.filename,
        date: new Date(row.date),
        answerFileUrl: row.answer_file_url || null,
        answerFileType: (row.answer_file_type as 'pdf' | 'image') || null,
        answerFilename: row.answer_filename || null,
        submitted: row.submitted,
        submissionDate: row.submission_date ? new Date(row.submission_date) : undefined,
        notificationId: row.notification_id,
    };
}

export async function addAssignment(assignment: Assignment): Promise<void> {
  await pool.query(
    'INSERT INTO assignments (id, title, description, subject, deadline, file_url, file_type, filename, date, answer_file_url, answer_file_type, answer_filename, submitted, submission_date, notification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)',
    [
      assignment.id,
      assignment.title,
      assignment.description,
      assignment.subject,
      assignment.deadline,
      assignment.fileUrl,
      assignment.fileType,
      assignment.filename,
      assignment.date,
      assignment.answerFileUrl || null,
      assignment.answerFileType || null,
      assignment.answerFilename || null,
      assignment.submitted || false,
      assignment.submissionDate || null,
      assignment.notificationId,
    ]
  );
}

export async function deleteAssignment(id: string): Promise<void> {
    await pool.query('DELETE FROM assignments WHERE id = $1', [id]);
}

export async function updateAssignmentSubmission(assignmentId: string, notificationId: string): Promise<boolean> {
  const submissionDate = new Date();
  
  const assignmentResult = await pool.query(
    'UPDATE assignments SET submitted = $1, submission_date = $2 WHERE id = $3',
    [true, submissionDate, assignmentId]
  );
  
  await pool.query(
    'UPDATE notifications SET submitted = $1, submission_date = $2 WHERE id = $3',
    [true, submissionDate, notificationId]
  );
  
  return assignmentResult.rowCount !== null && assignmentResult.rowCount > 0;
}

// --- Subjects ---
export async function getSubjects(): Promise<Subject[]> {
    const result = await pool.query('SELECT * FROM subjects ORDER BY name ASC');
    return result.rows;
}

export async function addSubject(subject: Subject): Promise<void> {
    await pool.query('INSERT INTO subjects (id, name) VALUES ($1, $2)', [subject.id, subject.name]);
}

export async function deleteSubject(id: string): Promise<void> {
    await pool.query('DELETE FROM subjects WHERE id = $1', [id]);
}