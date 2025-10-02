import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PaginationControls } from '@/components/shared/pagination';
import { format } from 'date-fns';
import type { Notification } from '@/lib/types';
import { notifications as allNotifications } from '@/lib/mock-data';
import { subHours } from 'date-fns';

const PAGE_SIZE = 5;

async function getNotifications(page: number) {
  const notifications = allNotifications
    .sort((a, b) => b.date.getTime() - a.date.getTime());
  
  const totalPages = Math.ceil(notifications.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  
  return {
    notifications: notifications.slice(start, end),
    totalPages,
  }
}

export default async function NotificationsPage({ searchParams }: { searchParams?: { page?: string } }) {
  const currentPage = Number(searchParams?.page) || 1;
  const { notifications, totalPages } = await getNotifications(currentPage);

  const twentyFourHoursAgo = subHours(new Date(), 24);

  const filteredNotifications = notifications.filter(n => {
    if (n.submitted && n.submissionDate) {
      return n.submissionDate.getTime() >= twentyFourHoursAgo.getTime();
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold">All Notifications</h1>
      {filteredNotifications && filteredNotifications.length > 0 ? (
        <div className="space-y-4">
          {filteredNotifications.map((notification: Notification) => (
            <Card key={notification.id}>
              <CardHeader>
                <CardTitle className="font-headline">{notification.title}</CardTitle>
                <CardDescription>
                  {format(notification.date, 'MMMM d, yyyy')}
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
