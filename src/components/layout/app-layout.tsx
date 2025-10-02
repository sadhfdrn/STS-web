'use client';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MainSidebar } from './main-sidebar';
import { Header } from './header';

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  const isLoginPage = pathname === '/login';

  return (
    <SidebarProvider>
      {isLoginPage ? (
        <main className="bg-background">
          {children}
        </main>
      ) : (
        <div className="flex min-h-screen w-full">
          <MainSidebar />
          <SidebarInset className="flex max-h-screen flex-1 flex-col bg-background">
            <Header />
            <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
              {children}
            </main>
          </SidebarInset>
        </div>
      )}
    </SidebarProvider>
  );
}
