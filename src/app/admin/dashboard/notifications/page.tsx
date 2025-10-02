import { NotificationForm } from "@/components/admin/notification-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import type { Notification } from "@/lib/types";
import { notifications } from "@/lib/mock-data";

async function getRecentNotifications() {
    return notifications
        .sort((a,b) => b.date.getTime() - a.date.getTime())
        .slice(0, 5);
}

export default async function AdminNotificationsPage() {
    const recentNotifications = await getRecentNotifications();
    
    return (
        <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Create Notification</CardTitle>
                        <CardDescription>Post a new announcement for students.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <NotificationForm />
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-2">
                <h2 className="text-2xl font-headline font-semibold mb-4">Recent Notifications</h2>
                 <Card>
                    <CardContent className="p-0">
                        <ul className="divide-y">
                        {recentNotifications.map(n => (
                            <li key={n.id} className="p-4">
                                <h3 className="font-semibold">{n.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">{n.description}</p>
                                <span className="text-xs text-muted-foreground/80">{format(n.date, 'PPpp')}</span>
                            </li>
                        ))}
                        </ul>
                    </CardContent>
                 </Card>
            </div>
        </div>
    );
}
