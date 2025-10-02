export type Subject = 'Statistics' | 'Physics' | 'English' | 'Mathematics' | 'Computer Science';
export type FileType = 'pdf' | 'image' | 'video';

export interface Notification {
  id: string;
  title: string;
  description: string;
  date: string; // ISO string
}

export interface CourseMaterial {
  id: string;
  subject: Subject;
  filename: string;
  file_url: string;
  file_type: FileType;
  upload_date: string; // ISO string
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  deadline: string; // ISO string
  file_url: string;
  file_type: 'pdf' | 'image';
  filename: string;
  date: string; // ISO string
  answer_file_url?: string | null;
  answer_file_type?: 'pdf' | 'image' | null;
  answer_filename?: string | null;
}
