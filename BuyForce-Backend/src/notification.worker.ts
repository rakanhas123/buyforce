import { Worker } from 'bullmq';
import { redisConnection } from './redis.connection';
import { sendEmail } from './services/email.service';
import { sendPushNotification } from './services/push.service';

let _notificationWorker: any = null;

try {
  _notificationWorker = new Worker(
    'notifications',
    async job => {
      const { channel, title, body, payload } = job.data;

      //  EMAIL
      if (channel === 'email') {
        if (!payload?.email) {
          throw new Error('Missing email in payload');
        }

        await sendEmail(payload.email, title, body);
      }

      //  PUSH
      if (channel === 'push') {
        if (!payload?.token) {
          throw new Error('Missing push token in payload');
        }

        await sendPushNotification(payload.token, title, body);
      }

      // 📝 IN_APP – לא שולחים החוצה (רק DB)
    },
    {
      connection: redisConnection,
    }
  );
} catch (err) {
  // If Redis is unavailable, don't crash the process — warn and continue without the worker.
  // eslint-disable-next-line no-console
  console.warn('Notification worker not started (Redis unavailable):', (err as any)?.message || err);
  _notificationWorker = null;
}

export const notificationWorker = _notificationWorker;
