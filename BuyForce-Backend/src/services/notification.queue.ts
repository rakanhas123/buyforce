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

export const notificationQueue = new Queue<NotificationJob>(
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
