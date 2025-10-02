import type { Notification, CourseMaterial, Assignment, Subject } from './types';

let notificationsData: Notification[] = [];

let courseMaterialsData: CourseMaterial[] = [];

let assignmentsData: Assignment[] = [];

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
