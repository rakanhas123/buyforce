import { Worker } from 'bullmq';
import { redisConnection } from './redis.connection';
import { sendEmail } from './services/email.service';
import { sendPushNotification } from './services/push.service';

export const notificationWorker = new Worker(
  'notifications',
  async job => {
    const { channel, title, body, payload } = job.data;

    //  EMAIL
    if (channel === 'email') {
      if (!payload?.email) {
        throw new Error('Missing email in payload');
      }

      await sendEmail(
        payload.email,
        title,
        body
      );
    }

    //  PUSH
    if (channel === 'push') {
      if (!payload?.token) {
        throw new Error('Missing push token in payload');
      }

      await sendPushNotification(
        payload.token,
        title,
        body
      );
    }

    // 📝 IN_APP – לא שולחים החוצה (רק DB)
  },
  {
    connection: redisConnection,
  }
);
