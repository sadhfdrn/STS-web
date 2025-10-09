'use client';

import { useEffect, useState } from 'react';
import { requestNotificationPermission, onMessageListener } from '@/lib/firebase';

export function usePushNotification() {
  const [token, setToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<any>(null);

  useEffect(() => {
    const setupNotifications = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/api/firebase-sw');
          console.log('Service Worker registered:', registration);
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      }
    };

    setupNotifications();
  }, []);

  const requestPermission = async () => {
    const fcmToken = await requestNotificationPermission();
    if (fcmToken) {
      setToken(fcmToken);
      return fcmToken;
    }
    return null;
  };

  useEffect(() => {
    const setupListener = async () => {
      const payload = await onMessageListener();
      if (payload) {
        setNotification(payload);
      }
    };

    setupListener();
  }, []);

  return {
    token,
    notification,
    requestPermission,
  };
}
