# StatsSite

## Overview

StatsSite is a Next.js-based web application designed for a university Statistics department (100-level). It serves as a centralized platform for students to access course materials, view notifications, and stay informed about departmental announcements. The application includes an admin dashboard for content management, allowing authorized users to post notifications and upload course materials.

The application is built with Next.js 15, uses React Server Components for optimal performance, and features a modern UI built with shadcn/ui components and Tailwind CSS. It implements a custom authentication system for admin access and provides a responsive, accessible interface with dark mode support.

## Recent Changes

**October 8, 2025:**
- **Push Notifications with Firebase Cloud Messaging**: Implemented push notifications that work even when browser is closed
  - Integrated Firebase Cloud Messaging (FCM) for server-side push notifications
  - Created `usePushNotification` hook for managing FCM subscription and token management
  - Created Firebase service worker (`/public/firebase-messaging-sw.js`) for background notifications
  - Implemented server-side push notification sending via Firebase Admin SDK
  - Created database table to store FCM tokens for subscribed users
  - Push notifications automatically sent when assignments or announcements are created
  - Users automatically subscribed when they create assignments or notifications in admin panel
- **Browser Notifications**: Added native browser notification support
  - Created `useBrowserNotification` hook for managing browser notification permissions and display
  - Integrated browser notifications in Assignment creation form
  - Integrated browser notifications in Notification creation form
  - Notifications automatically request permission on first use
  - Shows desktop notifications when assignments or announcements are created

**October 4, 2025:**
- **Performance & Animation Improvements**: Enhanced user experience with smooth animations and better perceived performance
  - Added CSS-based fade-in animations for page elements without hydration issues
  - Implemented loading skeleton components for assignments, materials, and notifications
  - Added hover effects with shadow lift and translate animations on cards
  - Implemented active state scale animations on buttons for tactile feedback
  - Added global smooth scroll behavior for better navigation experience
  - Fixed horizontal scroll issues on mobile for long filenames with proper text wrapping
- **Download Improvements**: Enhanced file download functionality
  - All downloads now proxy through the server for better control and security
  - Downloaded files are renamed to use the title instead of original filename (preserves file extension)
  - Created dedicated download routes for both materials and assignments

**October 2, 2025:**
- **PostgreSQL Database Migration**: Migrated from in-memory storage to PostgreSQL database
  - Created database tables for notifications, course_materials, and assignments
  - Implemented database connection module (`src/lib/db.ts`) with connection pooling
  - Updated all server actions to use database operations
  - Updated all pages to fetch data from PostgreSQL instead of mock data
  - Fixed Next.js 15 async cookies compliance in authentication module
- **Design Modernization**: Updated color scheme from green to vibrant purple/blue gradients for a more modern look
- **Hero Section Enhancement**: Added gradient background with texture overlay, larger typography, and clear CTAs
- **Card Design Improvements**: Added hover animations, gradient accents, and better visual hierarchy
- **Mobile Optimization**: Implemented responsive design with proper breakpoints for mobile, tablet, and desktop views
  - Responsive text sizing across all breakpoints
  - Mobile-first button layouts (stacking on mobile, horizontal on desktop)
  - Optimized spacing and padding for smaller screens

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The application uses Next.js 15 with the App Router pattern and React Server Components (RSC). The frontend is structured as follows:

**Component Organization:**
- **UI Components**: Leverages shadcn/ui library with Radix UI primitives for accessible, customizable components located in `src/components/ui/`
- **Feature Components**: Domain-specific components organized by feature (admin, auth, materials, layout, shared)
- **Server Components**: Pages are server components by default for improved performance and SEO
- **Client Components**: Interactive components explicitly marked with 'use client' directive (forms, theme toggle, session management)

**Styling:**
- Uses Tailwind CSS with CSS variables for theming
- Modern color scheme based on purple/blue gradients (Primary: HSL 262 83% 58%)
- Supports light and dark modes with theme persistence via localStorage
- Typography: Space Grotesk for headings, Inter for body text
- Fully responsive design with mobile-first approach

**State Management:**
- React Context API for theme and session management
- Server Actions for form submissions and data mutations
- Search params for pagination and filtering state

### Backend Architecture

**Authentication:**
- Custom cookie-based session management implemented in `src/lib/auth.ts`
- Admin credentials stored as hardcoded constants (simulating environment variables)
- Server-side session validation using Next.js middleware
- Protected routes via middleware pattern in `src/middleware.ts`
- Supports multiple admin users with email/password authentication

**Data Layer:**
- PostgreSQL database for persistent data storage
- Database connection pooling managed in `src/lib/db.ts` using `pg` library
- Database schema with three main tables:
  - `notifications`: Stores user notifications and announcements
  - `course_materials`: Stores uploaded course materials with metadata
  - `assignments`: Stores assignments with optional answer files
- Data structures defined in TypeScript types (`src/lib/types.ts`)
- Server Actions in `src/lib/actions.ts` handle data mutations and queries
- Legacy mock data file (`src/lib/mock-data.ts`) kept for reference but no longer used

**Server Actions:**
- `addNotification`: Creates new notifications with validation using Zod schema and saves to database
- `addMaterial`: Handles file uploads to Catbox API and saves metadata to database
- `addAssignment`: Creates assignments with file uploads and automatic notification creation
- `markAssignmentAsSubmitted`: Updates assignment and notification submission status in database
- `getAllNotifications`, `getAllCourseMaterials`, `getAllAssignments`: Fetch data from PostgreSQL for client components
- Form validation using `react-hook-form` with `@hookform/resolvers/zod`
- Path revalidation after mutations to update cached pages

**Routing:**
- Public routes: Home (`/`), Notifications (`/notifications`), Materials (`/materials`)
- Protected routes: Admin dashboard (`/admin/dashboard/*`) with sub-routes for notifications and materials management
- Login page (`/login`) with redirect logic

### Design Patterns

**Component Patterns:**
- Compound components for complex UI elements (Sidebar, Dialog, Form)
- Render props pattern for flexible component composition
- Higher-order components via Radix UI primitives
- Controlled and uncontrolled form patterns using react-hook-form

**Data Fetching:**
- Server-side data fetching in RSC pages
- Pagination and filtering via URL search parameters
- Debounced search inputs for better UX
- Optimistic UI updates with server action responses

**Code Organization:**
- Path aliases using `@/` for cleaner imports
- Separation of concerns: UI, business logic, and data access layers
- Colocation of related components and logic

### External Dependencies

**Core Framework:**
- **Next.js 15.3.3**: React framework with App Router, Server Components, and Server Actions
- **React 18.3.1**: UI library with concurrent features

**UI Components & Styling:**
- **shadcn/ui**: Pre-built accessible component library based on Radix UI
- **Radix UI**: Headless UI primitives (accordion, dialog, dropdown, select, etc.)
- **Tailwind CSS 3.x**: Utility-first CSS framework
- **lucide-react**: Icon library for consistent iconography
- **class-variance-authority**: Type-safe variant styling
- **tailwind-merge**: Utility for merging Tailwind classes

**Forms & Validation:**
- **react-hook-form**: Performant form state management
- **zod**: TypeScript-first schema validation
- **@hookform/resolvers**: Validation resolver for react-hook-form

**AI Integration:**
- **genkit**: Google's AI framework for building AI features
- **@genkit-ai/google-genai**: Google AI plugin for Genkit
- **@genkit-ai/next**: Next.js integration for Genkit

**Database:**
- **pg (node-postgres)**: PostgreSQL client for Node.js with connection pooling
- **@types/pg**: TypeScript type definitions for node-postgres

**Utilities:**
- **date-fns**: Modern date utility library for formatting and manipulation
- **dotenv**: Environment variable management
- **embla-carousel-react**: Carousel component
- **recharts**: Charting library for data visualization
- **use-debounce**: React hook for debouncing values

**Third-Party APIs:**
- **Catbox API**: File hosting service for course material uploads (to be integrated)
- **Firebase**: Mentioned in README as "Firebase Studio" but not currently integrated

**Development:**
- **TypeScript**: Type-safe JavaScript with strict mode enabled
- **patch-package**: For maintaining patches to npm packages
- **tsx**: TypeScript execution for dev scripts

**Database Configuration:**
- PostgreSQL database provided by Replit's built-in database service
- Connection managed via environment variables (DATABASE_URL, PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE)
- Tables created: `notifications`, `course_materials`, `assignments`
- All CRUD operations handled through connection pool for optimal performance