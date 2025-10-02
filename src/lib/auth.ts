// @ts-nocheck
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Mocking environment variables as specified in the prompt
const ADMIN_CREDENTIALS = {
  "admin1@example.com": "password_admin1",
  "admin2@example.com": "password_admin2",
  "test@example.com": "samuel",
};

export type Session = {
  email: string;
};

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { message: 'Email and password are required.' };
  }

  const expectedPassword = ADMIN_CREDENTIALS[email as keyof typeof ADMIN_CREDENTIALS];

  if (password === expectedPassword) {
    const session: Session = { email };
    cookies().set('session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    // This redirect will be caught by the try-catch in the form action
    redirect('/admin/dashboard');
  }

  return { message: 'Invalid credentials.' };
}

export async function logout() {
  cookies().delete('session');
  redirect('/login');
}

export async function getSession(): Promise<Session | null> {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) return null;
  try {
    // In a real app, you'd verify a JWT here.
    return JSON.parse(sessionCookie);
  } catch {
    return null;
  }
}
