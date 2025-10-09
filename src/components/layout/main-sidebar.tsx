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
import { Home, Bell, Book, LogIn, User, Power, FilePenLine, FolderKanban } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/auth';
import { useEffect } from 'react';

const menuItems = [
  { href: '/', label: 'Home', icon: Home, tooltip: 'Home' },
  { href: '/notifications', label: 'Notifications', icon: Bell, tooltip: 'Notifications' },
  { href: '/assignments', label: 'Assignments', icon: FilePenLine, tooltip: 'Assignments' },
  { href: '/materials', label: 'Course Materials', icon: Book, tooltip: 'Course Materials' },
];

const adminMenuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: User, tooltip: 'Admin Dashboard' },
    { href: '/admin/dashboard/notifications', label: 'Notifications', icon: Bell, tooltip: 'Manage Notifications' },
    { href: '/admin/dashboard/assignments', label: 'Assignments', icon: FilePenLine, tooltip: 'Manage Assignments' },
    { href: '/admin/dashboard/materials', label: 'Materials', icon: Book, tooltip: 'Manage Materials' },
    { href: '/admin/dashboard/subjects', label: 'Subjects', icon: FolderKanban, tooltip: 'Manage Subjects' },
]

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
          <Image src="/favicon-32x32.png" alt="ASSON Logo" width={32} height={32} className="w-8 h-8" />
          <span className="font-headline text-lg font-semibold whitespace-nowrap">ASSON</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton 
                asChild
                isActive={pathname === item.href}
                tooltip={item.tooltip}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        {session && (
            <SidebarMenu>
                <p className="text-xs text-muted-foreground px-2 pt-4 pb-2 group-data-[collapsible=icon]:hidden">Admin</p>
                {adminMenuItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                            asChild
                            isActive={pathname === item.href}
                            tooltip={item.tooltip}
                        >
                            <Link href={item.href}>
                                <item.icon />
                                <span>{item.label}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        )}
      </SidebarContent>
      <SidebarFooter>
        {session ? (
          <>
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
              <SidebarMenuButton 
                asChild
                tooltip="Admin Login" 
                isActive={pathname === '/login'}
              >
                <Link href="/login">
                  <LogIn />
                  <span>Login</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
