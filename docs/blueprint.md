# **App Name**: StatsSite

## Core Features:

- Admin Authentication: Secure authentication for admins using credentials stored in environment variables.
- Notification Management: Admins can create and post notifications (title, date, description) with optional fields via admin dashboard.
- Course Material Upload: Upload course materials into subject categories, upload file to Catbox API, save the download link and metadata to PostgreSQL database.
- Course Material Display: Display paginated course materials, organized by subject. Display title/filename, subject, and a download button linking to the Catbox URL.
- Notification Display: Paginated list of notifications. Display title, date, and description.
- Search and Filter: Enable search and filter options for course materials by subject and file type.
- Dark Mode Toggle: Add a toggle for dark mode that persists using localStorage.

## Style Guidelines:

- Primary color: Forest green (#388E3C), evokes nature and academia.
- Background color: Light green (#E8F5E9), a desaturated, bright shade of green for a calming effect.
- Accent color: Darker green (#1B5E20), to complement the primary color with high contrast.
- Font pairing: 'Space Grotesk' (sans-serif) for headings and 'Inter' (sans-serif) for body text.
- Use simple, clear icons for navigation and file types.
- Responsive layout with sidebar navigation and clear content sections.
- Subtle transitions and animations for interactive elements.