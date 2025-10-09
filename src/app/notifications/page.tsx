'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PaginationControls } from '@/components/shared/pagination';
import { format, subHours } from 'date-fns';
import type { Notification } from '@/lib/types';
import { getAllNotifications } from '@/lib/actions';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

const PAGE_SIZE = 5;

export default function NotificationsPage() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const levelFilter = searchParams.get('level');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function loadNotifications() {
      const allNotifications = await getAllNotifications();
      const sorted = allNotifications.sort((a, b) => b.date.getTime() - a.date.getTime());
      
      const twentyFourHoursAgo = subHours(new Date(), 24);
      let filtered = sorted.filter(n => {
        if (n.submitted && n.submissionDate) {
          return n.submissionDate.getTime() >= twentyFourHoursAgo.getTime();
        }
        return true;
      });

      if (levelFilter) {
        filtered = filtered.filter(n => n.level === levelFilter);
      }

      const pages = Math.ceil(filtered.length / PAGE_SIZE);
      const start = (currentPage - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      
      setNotifications(filtered.slice(start, end));
      setTotalPages(pages);
    }
    loadNotifications();
  }, [currentPage, levelFilter]);


  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold">All Notifications</h1>
      {notifications && notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification: Notification) => (
            <Card key={notification.id}>
              <CardHeader>
                <CardTitle className="font-headline">{notification.title}</CardTitle>
                <CardDescription>
                  {format(notification.date, 'MMMM d, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{notification.description}</p>
                {notification.eventDate && (
                  <p className="text-xs text-primary font-medium mt-2">
                      Event on: {format(notification.eventDate, 'PPpp')}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p>No notifications found.</p>
      )}
      {totalPages > 1 && <PaginationControls totalPages={totalPages} />}
    </div>
  );
}
