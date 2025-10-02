import { getNotifications } from '@/lib/mock-data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';
import type { Notification } from '@/lib/types';

export default function Home() {
  const latestNotifications = getNotifications({ page: 1, limit: 3 }).data;

  return (
    <div className="space-y-8">
      <section className="bg-card border rounded-lg p-8 shadow-sm">
        <h1 className="font-headline text-4xl font-bold text-primary">
          Welcome to StatsSite
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Your central hub for the 100-level Statistics department. Find course materials, announcements, and more.
        </p>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline text-3xl font-semibold">Latest Notifications</h2>
          <Button asChild variant="link">
            <Link href="/notifications">View all</Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {latestNotifications.map((notification: Notification) => (
            <Card key={notification.id}>
              <CardHeader>
                <CardTitle className="font-headline">{notification.title}</CardTitle>
                <CardDescription>
                  {format(new Date(notification.date), 'MMMM d, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-muted-foreground">{notification.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
