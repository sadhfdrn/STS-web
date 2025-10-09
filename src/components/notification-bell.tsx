'use client';

import { useState, useEffect } from 'react';
import { Bell, BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { usePushNotification } from '@/hooks/use-push-notification';
import { saveFcmToken } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

const levels = ['100', '200', '300', '400'];

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { requestPermission, token } = usePushNotification();
  const { toast } = useToast();

  useEffect(() => {
    const savedLevels = localStorage.getItem('notificationLevels');
    if (savedLevels) {
      const parsedLevels = JSON.parse(savedLevels);
      setSelectedLevels(parsedLevels);
      setIsSubscribed(parsedLevels.length > 0);
    }
  }, []);

  const handleLevelToggle = (level: string) => {
    setSelectedLevels(prev => {
      if (prev.includes(level)) {
        return prev.filter(l => l !== level);
      } else {
        return [...prev, level];
      }
    });
  };

  const handleSubscribe = async () => {
    if (selectedLevels.length === 0) {
      toast({
        title: 'No levels selected',
        description: 'Please select at least one level to subscribe to notifications.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const fcmToken = await requestPermission();
      if (fcmToken) {
        await saveFcmToken(fcmToken);
        localStorage.setItem('notificationLevels', JSON.stringify(selectedLevels));
        setIsSubscribed(true);
        toast({
          title: 'Subscribed successfully!',
          description: `You'll receive notifications for ${selectedLevels.length} level(s).`,
        });
        setOpen(false);
      } else {
        toast({
          title: 'Permission denied',
          description: 'Please allow notifications in your browser settings.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: 'Subscription failed',
        description: 'Could not subscribe to notifications. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUnsubscribe = () => {
    localStorage.removeItem('notificationLevels');
    setSelectedLevels([]);
    setIsSubscribed(false);
    toast({
      title: 'Unsubscribed',
      description: 'You will no longer receive push notifications.',
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {isSubscribed ? (
            <BellRing className="h-5 w-5 text-primary" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {isSubscribed && selectedLevels.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
              {selectedLevels.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Notification Subscriptions</DialogTitle>
          <DialogDescription>
            Subscribe to push notifications for one or more levels
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-3">
            {levels.map(level => (
              <div key={level} className="flex items-center space-x-3">
                <Checkbox
                  id={`level-${level}`}
                  checked={selectedLevels.includes(level)}
                  onCheckedChange={() => handleLevelToggle(level)}
                />
                <Label
                  htmlFor={`level-${level}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {level} Level
                </Label>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            {isSubscribed ? (
              <>
                <Button onClick={handleSubscribe} className="flex-1">
                  Update Subscription
                </Button>
                <Button onClick={handleUnsubscribe} variant="outline" className="flex-1">
                  Unsubscribe
                </Button>
              </>
            ) : (
              <Button onClick={handleSubscribe} className="w-full">
                Subscribe
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
