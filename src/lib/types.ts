
export type FileType = 'pdf' | 'image' | 'video';

export interface Notification {
  id: string;
  title: string;
  description: string;
  date: Date;
  eventDate?: Date;
  submitted?: boolean;
  submissionDate?: Date;
}

export interface Subject {
  id: string;
  name: string;
}

export interface CourseMaterial {
  id: string;
  title: string;
  subject: string;
  filename: string;
  fileUrl: string;
  fileType: FileType;
  uploadDate: Date;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
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
