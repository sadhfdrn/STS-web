# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Deployment

When deploying this application to a hosting provider like Vercel, you need to configure the environment variables for your admin users.

The Firebase project configuration is already included in the source code, so you **do not** need to set any Firebase-related environment variables for the client-side application to connect to Firestore and Firebase Auth.

### Required Environment Variables

Create the following environment variables in your Vercel project settings:

```
ADMIN_1="admin1@example.com,your-secure-password"
ADMIN_2="admin2@example.com,another-secure-password"
```

You can add as many `ADMIN_` variables as you need. This is the only configuration required to get your deployed application running.
