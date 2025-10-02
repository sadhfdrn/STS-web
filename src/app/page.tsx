import { getNotifications } from '@/lib/mock-data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';
import type { Notification } from '@/lib/types';

export default function Home() {
  const latestNotifications = getNotifications({ page: 1, limit: 3 }).data;

  return (
    <div className="space-y-8 md:space-y-12">
      <section className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-6 sm:p-8 md:p-12 shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAtMTRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bS0xNCAwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDE0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        <div className="relative z-10">
          <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            Welcome to StatsSite
          </h1>
          <p className="mt-3 md:mt-4 text-base sm:text-lg md:text-xl text-white/90 max-w-3xl">
            Your central hub for the 100-level Statistics department. Find course materials, announcements, and more.
          </p>
          <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button asChild size="lg" variant="secondary" className="font-semibold shadow-xl w-full sm:w-auto">
              <Link href="/materials">Explore Materials</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/20 hover:text-white font-semibold w-full sm:w-auto">
              <Link href="/notifications">Latest Updates</Link>
            </Button>
          </div>
        </div>
      </section>

      <section>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 md:mb-6">
          <div>
            <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Latest Notifications</h2>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">Stay updated with the latest announcements</p>
          </div>
          <Button asChild variant="ghost" className="text-primary hover:text-primary/80 self-start sm:self-auto">
            <Link href="/notifications">View all →</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {latestNotifications.map((notification: Notification) => (
            <Card key={notification.id} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-primary via-primary/80 to-primary/60 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              <CardHeader className="pb-3">
                <CardTitle className="font-headline text-xl group-hover:text-primary transition-colors">{notification.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {format(new Date(notification.date), 'MMMM d, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">{notification.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
