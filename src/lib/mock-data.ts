import { subDays, subHours } from 'date-fns';
import type { Notification, CourseMaterial, Subject, FileType } from './types';

const now = new Date();

export const NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Midterm Exam Schedule Announced', description: 'The schedule for the upcoming midterm exams has been posted. Please check the "Course Materials" section for the detailed PDF.', date: subDays(now, 1).toISOString() },
  { id: '2', title: 'Guest Lecture on Bayesian Statistics', description: 'Join us for a special guest lecture by Dr. Evelyn Reed on advanced Bayesian methods. The event will be held in Hall 5 on Friday.', date: subDays(now, 2).toISOString() },
  { id: '3', title: 'Assignment 3 Deadline Extended', description: 'The deadline for Assignment 3 has been extended by 48 hours. The new due date is this Wednesday at 11:59 PM.', date: subDays(now, 3).toISOString() },
  { id: '4', title: 'Office Hours Canceled for Today', description: 'Professor Carter\'s office hours are canceled for today, April 15th. Please email for urgent inquiries.', date: subDays(now, 5).toISOString() },
  { id: '5', title: 'New Practice Problems Uploaded', description: 'A new set of practice problems covering chapters 4 and 5 is now available in the materials section.', date: subDays(now, 7).toISOString() },
  { id: '6', title: 'Welcome to the New Semester!', description: 'Welcome back, students! We look forward to a productive and engaging semester. Please review the updated syllabus.', date: subDays(now, 10).toISOString() },
];

export const COURSE_MATERIALS: CourseMaterial[] = [
  { id: '1', subject: 'Statistics', filename: 'Chapter 1 - Introduction.pdf', file_url: '#', file_type: 'pdf', upload_date: subDays(now, 5).toISOString() },
  { id: '2', subject: 'Statistics', filename: 'Lecture 3 - Probability.mp4', file_url: '#', file_type: 'video', upload_date: subDays(now, 8).toISOString() },
  { id: '3', subject: 'Physics', filename: 'Newtonian Mechanics.pdf', file_url: '#', file_type: 'pdf', upload_date: subDays(now, 12).toISOString() },
  { id: '4', subject: 'English', filename: 'Literary Analysis Guide.pdf', file_url: '#', file_type: 'pdf', upload_date: subDays(now, 15).toISOString() },
  { id: '5', subject: 'Statistics', filename: 'Correlation vs Causation.png', file_url: '#', file_type: 'image', upload_date: subHours(now, 30).toISOString() },
  { id: '6', subject: 'Mathematics', filename: 'Calculus I Review Sheet.pdf', file_url: '#', file_type: 'pdf', upload_date: subDays(now, 20).toISOString() },
  { id: '7', subject: 'Computer Science', filename: 'Intro to Algorithms.pdf', file_url: '#', file_type: 'pdf', upload_date: subDays(now, 22).toISOString() },
  { id: '8', subject: 'Statistics', filename: 'Hypothesis Testing.mp4', file_url: '#', file_type: 'video', upload_date: subDays(now, 25).toISOString() },
];

export function getNotifications({ page = 1, limit = 5 }: { page: number; limit: number }) {
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedData = NOTIFICATIONS.slice(start, end);
  return {
    data: paginatedData,
    totalPages: Math.ceil(NOTIFICATIONS.length / limit),
  };
}

export function getMaterials({ page = 1, limit = 6, subject, fileType, query }: { page: number; limit: number; subject?: Subject | 'All'; fileType?: FileType | 'All'; query?: string }) {
  let filteredMaterials = COURSE_MATERIALS;

  if (subject && subject !== 'All') {
    filteredMaterials = filteredMaterials.filter(m => m.subject === subject);
  }
  if (fileType && fileType !== 'All') {
    filteredMaterials = filteredMaterials.filter(m => m.file_type === fileType);
  }
  if (query) {
    filteredMaterials = filteredMaterials.filter(m => m.filename.toLowerCase().includes(query.toLowerCase()));
  }
  
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedData = filteredMaterials.slice(start, end);
  
  return {
    data: paginatedData,
    totalPages: Math.ceil(filteredMaterials.length / limit),
  };
}
