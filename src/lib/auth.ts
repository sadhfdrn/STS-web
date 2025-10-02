'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SignJWT, jwtVerify } from 'jose';

export type Session = {
  email: string;
};

// This secret is used to sign the session cookie.
// It should be stored in an environment variable.
const secretKey = process.env.SESSION_SECRET || 'a_default_secret_that_is_not_secure';
const key = new TextEncoder().encode(secretKey);

async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(key);
}

async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

// Helper to get all admin users from environment variables
function getAdminUsers() {
    const admins: Record<string, string> = {};
    let i = 1;
    while (process.env[`ADMIN_${i}`]) {
        const adminString = process.env[`ADMIN_${i}`];
        if(adminString) {
            const [email, password] = adminString.split(',');
            if (email && password) {
                admins[email.trim()] = password.trim();
            }
        }
        i++;
    }
    
    // A default user for testing if no admins are set in env
    if (Object.keys(admins).length === 0) {
        admins['test@example.com'] = 'samuel';
    }

    return admins;
}


export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { message: 'Email and password are required.' };
  }

  const adminUsers = getAdminUsers();
  const expectedPassword = adminUsers[email];

  if (password === expectedPassword) {
    // Create the session
    const session: Session = { email };
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
    const sessionCookie = await encrypt({ session, expires });

    // Save the session in a cookie
    cookies().set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires,
      path: '/',
    });
    
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
  
  const decryptedSession = await decrypt(sessionCookie);
  if (!decryptedSession) return null;
  
  // Check if session has expired
  if (new Date(decryptedSession.expires) < new Date()) {
    return null;
  }

  return decryptedSession.session;
}
