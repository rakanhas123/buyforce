import { Queue } from 'bullmq';
import { redisConnection } from '../redis.connection';

export type NotificationChannel = 'push' | 'email' | 'in_app';

export type NotificationType =
  | 'GROUP_JOINED'
  | 'GROUP_70'
  | 'GROUP_95';

export interface NotificationJob {
  userId: string;
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  body: string;
  payload?: Record<string, any>;
}

let _notificationQueue: any = null;

try {
  _notificationQueue = new Queue<NotificationJob>(
    'notifications',
    {
      connection: redisConnection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 60_000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    }
  );
} catch (err) {
  // If Redis is unavailable, provide a no-op queue to avoid crashing the app
  // Log the error and continue; callers can still call `add` safely.
  // eslint-disable-next-line no-console
  console.warn('Notification queue not available (Redis failed to initialize):', (err as any)?.message || err);
  _notificationQueue = {
    add: async (_name: string | undefined, _data: NotificationJob) => ({ id: 'noop' }),
  };
}

export const notificationQueue = _notificationQueue;
