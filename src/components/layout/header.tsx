'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { NotificationBell } from '@/components/notification-bell';
import { usePathname } from 'next/navigation';
import { useSession } from '@/components/session-provider';

export function Header() {
    const pathname = usePathname();
    const session = useSession();

    const getPageTitle = () => {
        if (pathname === '/') return 'Home';
        if (pathname.startsWith('/level/')) {
            const levelId = pathname.split('/')[2];
            return `${levelId} Level Portal`;
        }
        if (pathname.startsWith('/notifications')) return 'Notifications';
        if (pathname.startsWith('/materials')) return 'Course Materials';
        if (pathname.startsWith('/assignments')) return 'Assignments';
        if (pathname.startsWith('/admin')) {
             const pathParts = pathname.split('/');
             const lastPart = pathParts.filter(p => p).pop() || 'dashboard';
             if(lastPart === 'dashboard' || lastPart === 'admin') return 'Admin Dashboard';
             const title = lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
             return `Admin / ${title}`;
        }
        return 'ASSON';
    };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-lg font-semibold md:text-xl font-headline">{getPageTitle()}</h1>
      </div>
      <div className="flex items-center gap-2">
        {session?.email && (
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {session.email}
            </span>
        )}
        <NotificationBell />
        <ThemeToggle />
      </div>
    </header>
  );
}
