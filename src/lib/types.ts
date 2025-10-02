import { Timestamp } from "firebase/firestore";

export type Subject = 'Statistics' | 'Physics' | 'English' | 'Mathematics' | 'Computer Science';
export type FileType = 'pdf' | 'image' | 'video';

export interface Notification {
  id: string;
  title: string;
  description: string;
  date: Timestamp;
  submitted?: boolean;
  submissionDate?: Timestamp;
}

export interface CourseMaterial {
  id: string;
  subject: Subject;
  filename: string;
  fileUrl: string;
  fileType: FileType;
  uploadDate: Timestamp;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  deadline: Timestamp;
  fileUrl: string;
  fileType: 'pdf' | 'image';
  filename: string;
  date: Timestamp;
  answerFileUrl?: string | null;
  answerFileType?: 'pdf' | 'image' | null;
  answerFilename?: string | null;
  submitted?: boolean;
  submissionDate?: Timestamp;
  notificationId?: string;
}
