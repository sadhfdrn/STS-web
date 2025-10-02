'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PaginationControls } from '@/components/shared/pagination';
import { format } from 'date-fns';
import type { Notification } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, startAfter, getDocs, getCountFromServer, where, Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { subHours } from 'date-fns';

const PAGE_SIZE = 5;

export default function NotificationsPage({ searchParams }: { searchParams?: { page?: string } }) {
  const currentPage = Number(searchParams?.page) || 1;
  const firestore = useFirestore();
  const [lastVisible, setLastVisible] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  
  const twentyFourHoursAgo = subHours(new Date(), 24);
  const twentyFourHoursAgoTimestamp = Timestamp.fromDate(twentyFourHoursAgo);

  const notificationsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    let q = query(
        collection(firestore, 'notifications'),
        orderBy('date', 'desc'),
        limit(PAGE_SIZE)
      );
    if(currentPage > 1 && lastVisible) {
        q = query(
            collection(firestore, 'notifications'),
            orderBy('date', 'desc'),
            startAfter(lastVisible),
            limit(PAGE_SIZE)
        );
    }
    return q;
  }, [firestore, currentPage, lastVisible]);
  
  const { data: notifications, isLoading } = useCollection<Notification>(notificationsQuery);

  useEffect(() => {
    if(firestore) {
        const countQuery = query(collection(firestore, 'notifications'));
        getCountFromServer(countQuery).then(snapshot => {
            setTotalPages(Math.ceil(snapshot.data().count / PAGE_SIZE));
        });

        if (currentPage > 1) {
            const fetchLastVisible = async () => {
                const firstPageQuery = query(collection(firestore, 'notifications'), orderBy('date', 'desc'), limit(PAGE_SIZE * (currentPage - 1)));
                const documentSnapshots = await getDocs(firstPageQuery);
                const last = documentSnapshots.docs[documentSnapshots.docs.length - 1];
                setLastVisible(last);
            }
            fetchLastVisible();
        } else {
            setLastVisible(null);
        }
    }
  }, [firestore, currentPage]);

  const filteredNotifications = notifications?.filter(n => {
    if (n.submitted && n.submissionDate) {
      return n.submissionDate.toMillis() >= twentyFourHoursAgoTimestamp.toMillis();
    }
    return true;
  });


  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold">All Notifications</h1>
      {isLoading ? <p>Loading notifications...</p> : (
        <>
          {filteredNotifications && filteredNotifications.length > 0 ? (
            <div className="space-y-4">
              {filteredNotifications.map((notification: Notification) => (
                <Card key={notification.id}>
                  <CardHeader>
                    <CardTitle className="font-headline">{notification.title}</CardTitle>
                    <CardDescription>
                      {format(notification.date.toDate(), 'MMMM d, yyyy')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{notification.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p>No notifications found.</p>
          )}
          {totalPages > 1 && <PaginationControls totalPages={totalPages} />}
        </>
      )}
    </div>
  );
}
