import { NotificationForm } from "@/components/admin/notification-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import type { Notification } from "@/lib/types";
import { getNotifications } from "@/lib/db";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteNotification } from "@/lib/actions";

async function getRecentNotifications() {
    const notifications = await getNotifications();
    return notifications.slice(0, 5);
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
                            <li key={n.id} className="p-4 group">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 pr-4">
                                        <h3 className="font-semibold">{n.title}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{n.description}</p>
                                        <span className="text-xs text-muted-foreground/80">{format(n.date, 'PPpp')}</span>
                                        {n.eventDate && (
                                            <p className="text-xs text-primary font-medium mt-1">
                                                Event on: {format(n.eventDate, 'PPpp')}
                                            </p>
                                        )}
                                    </div>
                                    <DeleteButton
                                        id={n.id}
                                        deleteAction={deleteNotification}
                                        itemName={n.title}
                                        itemType="Notification"
                                    />
                                </div>
                            </li>
                        ))}
                        </ul>
                    </CardContent>
                 </Card>
            </div>
        </div>
    );
}
