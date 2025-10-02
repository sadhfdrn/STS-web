import { getNotifications } from '@/lib/mock-data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PaginationControls } from '@/components/shared/pagination';
import { format } from 'date-fns';
import type { Notification } from '@/lib/types';

export default function NotificationsPage({ searchParams }: { searchParams?: { page?: string } }) {
  const currentPage = Number(searchParams?.page) || 1;
  const { data: notifications, totalPages } = getNotifications({ page: currentPage, limit: 5 });

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold">All Notifications</h1>
      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification: Notification) => (
            <Card key={notification.id}>
              <CardHeader>
                <CardTitle className="font-headline">{notification.title}</CardTitle>
                <CardDescription>
                  {format(new Date(notification.date), 'MMMM d, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{notification.description}</p>
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
