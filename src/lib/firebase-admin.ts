import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

const initAdmin = () => {
  if (getApps().length === 0) {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT || '{}'
    );

    initializeApp({
      credential: cert(serviceAccount),
    });
  }
};

export const sendPushNotification = async (
  title: string,
  body: string,
  tokens: string[]
) => {
  try {
    initAdmin();
    const messaging = getMessaging();

    const message = {
      notification: {
        title,
        body,
      },
      tokens,
    };

    const response = await messaging.sendEachForMulticast(message);
    console.log('Successfully sent messages:', response);
    return response;
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw error;
  }
};
