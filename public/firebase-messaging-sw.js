importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDN3y_jzcF1BBS-vl6YQzVd34GJlHGAXM8",
  authDomain: "sts-web-71a6f.firebaseapp.com",
  projectId: "sts-web-71a6f",
  storageBucket: "sts-web-71a6f.firebasestorage.app",
  messagingSenderId: "590883336605",
  appId: "1:590883336605:web:189431962fee26c6fdff74"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    tag: payload.data?.tag || 'default',
    requireInteraction: true,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
