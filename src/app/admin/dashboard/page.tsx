import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bell, BookOpen, FilePenLine, FolderKanban } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage site content and settings.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Bell className="h-5 w-5" /> Manage Notifications
            </CardTitle>
            <CardDescription>
              Create, view, and edit announcements for students.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/dashboard/notifications">Go to Notifications</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <FilePenLine className="h-5 w-5" /> Manage Assignments
            </CardTitle>
            <CardDescription>
              Create new assignments and post them as notifications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/dashboard/assignments">Go to Assignments</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <BookOpen className="h-5 w-5" /> Manage Course Materials
            </CardTitle>
            <CardDescription>
              Upload and organize course files like PDFs, images, and videos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/dashboard/materials">Go to Materials</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <FolderKanban className="h-5 w-5" /> Manage Subjects
            </CardTitle>
            <CardDescription>
              Add or remove subjects for course materials and assignments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/dashboard/subjects">Go to Subjects</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
