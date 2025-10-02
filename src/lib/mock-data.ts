import type { Notification, CourseMaterial, Assignment, Subject } from './types';

let notificationsData: Notification[] = [
  {
    id: 'notif-1',
    title: 'Welcome to StatsSite!',
    description: 'This is the official new website for the 100-level Statistics department. Browse around to find materials and announcements.',
    date: new Date('2025-09-01T10:00:00Z'),
  },
  {
    id: 'notif-2',
    title: 'Midterm Exam Schedule Announced',
    description: 'The midterm exams for all 100-level courses will take place in the second week of October. Please check the "Assignments" section for the detailed schedule for your course.',
    date: new Date('2025-09-10T14:30:00Z'),
  },
  {
    id: 'notif-3',
    title: 'Office Hours Update',
    description: 'Professor Oak\'s office hours for next week have been moved from Tuesday to Wednesday, 2-4 PM.',
    date: new Date('2025-09-12T11:00:00Z'),
  },
];

let courseMaterialsData: CourseMaterial[] = [
  {
    id: 'mat-1',
    subject: 'Statistics',
    filename: 'Lecture_1_Intro_to_Stats.pdf',
    fileUrl: '#',
    fileType: 'pdf',
    uploadDate: new Date('2025-09-02T09:00:00Z'),
  },
  {
    id: 'mat-2',
    subject: 'Statistics',
    filename: 'Probability_Distribution_Chart.png',
    fileUrl: '#',
    fileType: 'image',
    uploadDate: new Date('2025-09-05T15:00:00Z'),
  },
  {
    id: 'mat-3',
    subject: 'Physics',
    filename: 'Intro_to_Kinematics.mp4',
    fileUrl: '#',
    fileType: 'video',
    uploadDate: new Date('2025-09-03T11:00:00Z'),
  },
  {
    id: 'mat-4',
    subject: 'English',
    filename: 'Essay_Writing_Guide.pdf',
    fileUrl: '#',
    fileType: 'pdf',
    uploadDate: new Date('2025-09-04T16:30:00Z'),
  },
];

let assignmentsData: Assignment[] = [
  {
    id: 'asg-1',
    title: 'Homework 1: Descriptive Statistics',
    description: 'Complete the exercises from Chapter 1 of the textbook. Show your work for all calculations.',
    subject: 'Statistics',
    deadline: new Date('2025-09-15T23:59:00Z'),
    fileUrl: '#',
    fileType: 'pdf',
    filename: 'Homework_1.pdf',
    date: new Date('2025-09-08T13:00:00Z'),
    notificationId: 'notif-4',
  },
  {
    id: 'asg-2',
    title: 'Lab Report: Free Fall Experiment',
    description: 'Submit your lab report for the free fall experiment conducted last week.',
    subject: 'Physics',
    deadline: new Date('2025-09-18T23:59:00Z'),
    fileUrl: '#',
    fileType: 'pdf',
    filename: 'Lab_Report_Guidelines.pdf',
    date: new Date('2025-09-11T10:00:00Z'),
    notificationId: 'notif-5',
    answerFileUrl: '#',
    answerFilename: 'Lab_Report_Answers.pdf',
    answerFileType: 'pdf',
  },
];

// Add corresponding notifications for assignments
notificationsData.push({
    id: 'notif-4',
    title: 'New Assignment: Homework 1: Descriptive Statistics',
    description: 'Complete the exercises from Chapter 1 of the textbook. Show your work for all calculations.. Deadline: Sep 15, 2025. View details in the Assignments section.',
    date: new Date('2025-09-08T13:00:00Z'),
});
notificationsData.push({
    id: 'notif-5',
    title: 'New Assignment: Lab Report: Free Fall Experiment',
    description: 'Submit your lab report for the free fall experiment conducted last week.. Deadline: Sep 18, 2025. View details in the Assignments section.',
    date: new Date('2025-09-11T10:00:00Z'),
});

export const notifications: Notification[] = notificationsData;
export const courseMaterials: CourseMaterial[] = courseMaterialsData;
export const assignments: Assignment[] = assignmentsData;

export function addData(type: 'notifications' | 'courseMaterials' | 'assignments', data: any) {
  if (type === 'notifications') {
    notificationsData.unshift(data as Notification);
  } else if (type === 'courseMaterials') {
    courseMaterialsData.unshift(data as CourseMaterial);
  } else if (type === 'assignments') {
    assignmentsData.unshift(data as Assignment);
  }
}
