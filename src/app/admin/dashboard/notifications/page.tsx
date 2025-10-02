import { NotificationForm } from "@/components/admin/notification-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getNotifications } from "@/lib/mock-data";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

export default function AdminNotificationsPage() {
    const { data: recentNotifications } = getNotifications({ page: 1, limit: 5 });
    
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
                                   <span className="text-xs text-muted-foreground/80">{format(new Date(n.date), 'PPpp')}</span>
                               </li>
                           ))}
                        </ul>
                    </CardContent>
                 </Card>
            </div>
        </div>
    );
}
