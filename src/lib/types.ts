
export type Subject = 'Statistics' | 'Physics' | 'English' | 'Mathematics' | 'Computer Science';
export type FileType = 'pdf' | 'image' | 'video';

export interface Notification {
  id: string;
  title: string;
  description: string;
  date: Date;
  submitted?: boolean;
  submissionDate?: Date;
}

export interface CourseMaterial {
  id: string;
  subject: Subject;
  filename: string;
  fileUrl: string;
  fileType: FileType;
  uploadDate: Date;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  deadline: Date;
  fileUrl: string;
  fileType: 'pdf' | 'image';
  filename: string;
  date: Date;
  answerFileUrl?: string | null;
  answerFileType?: 'pdf' | 'image' | null;
  answerFilename?: string | null;
  submitted?: boolean;
  submissionDate?: Date;
  notificationId?: string;
}
