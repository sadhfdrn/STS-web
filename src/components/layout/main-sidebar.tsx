'use client';

import { useSession } from '@/components/session-provider';
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  useSidebar
} from '@/components/ui/sidebar';
import { Home, Bell, Book, LogIn, User, Power, FilePenLine } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/auth';
import { useEffect } from 'react';

const menuItems = [
  { href: '/', label: 'Home', icon: Home, tooltip: 'Home' },
  { href: '/notifications', label: 'Notifications', icon: Bell, tooltip: 'Notifications' },
  { href: '/assignments', label: 'Assignments', icon: FilePenLine, tooltip: 'Assignments' },
  { href: '/materials', label: 'Course Materials', icon: Book, tooltip: 'Course Materials' },
];

export function MainSidebar() {
  const pathname = usePathname();
  const session = useSession();
  const { setOpenMobile, isMobile } = useSidebar();

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [pathname, isMobile, setOpenMobile]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
          <Logo className="w-8 h-8" />
          <span className="font-headline text-lg font-semibold whitespace-nowrap">StatsSite</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref>
                <SidebarMenuButton 
                  isActive={pathname === item.href}
                  tooltip={item.tooltip}
                  asChild={false}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        {session ? (
          <>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/admin/dashboard" passHref>
                  <SidebarMenuButton tooltip="Admin Dashboard" isActive={pathname.startsWith('/admin')}>
                    <User />
                    <span>Admin</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
            <form action={logout} className="p-2">
                <Button variant="ghost" size="icon" className="w-full justify-center group-data-[collapsible=icon]:!w-8 group-data-[collapsible=icon]:!h-8">
                    <Power className="h-4 w-4" />
                    <span className="group-data-[collapsible=icon]:hidden">Logout</span>
                </Button>
            </form>
          </>
        ) : (
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/login" passHref>
                <SidebarMenuButton tooltip="Admin Login" isActive={pathname === '/login'}>
                  <LogIn />
                  <span>Login</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
