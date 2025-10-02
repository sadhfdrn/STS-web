import { Pool } from 'pg';
import type { Notification, CourseMaterial, Assignment } from './types';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
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
    submitted: row.submitted,
    submissionDate: row.submission_date ? new Date(row.submission_date) : undefined,
  }));
}

export async function addNotification(notification: Notification): Promise<void> {
  await pool.query(
    'INSERT INTO notifications (id, title, description, date, submitted, submission_date) VALUES ($1, $2, $3, $4, $5, $6)',
    [notification.id, notification.title, notification.description, notification.date, notification.submitted || false, notification.submissionDate || null]
  );
}

export async function getCourseMaterials(): Promise<CourseMaterial[]> {
  const result = await pool.query(
    'SELECT * FROM course_materials ORDER BY upload_date DESC'
  );
  return result.rows.map(row => ({
    id: row.id,
    subject: row.subject,
    filename: row.filename,
    fileUrl: row.file_url,
    fileType: row.file_type,
    uploadDate: new Date(row.upload_date),
  }));
}

export async function addCourseMaterial(material: CourseMaterial): Promise<void> {
  await pool.query(
    'INSERT INTO course_materials (id, subject, filename, file_url, file_type, upload_date) VALUES ($1, $2, $3, $4, $5, $6)',
    [material.id, material.subject, material.filename, material.fileUrl, material.fileType, material.uploadDate]
  );
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
