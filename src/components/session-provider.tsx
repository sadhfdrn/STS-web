'use client';

import type { Session } from '@/lib/auth';
import { createContext, useContext, ReactNode } from 'react';

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ children, session }: { children: ReactNode; session: Session | null }) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
