import { Worker, Job } from "bullmq";
import { redisConnection } from "./redis.connection";

// import connection from "./redis.connection";

const worker = new Worker(
  "notification-queue",
  async (job: Job) => {
    console.log("Processing job:", job.id, job.data);
    // כאן תשימי את הקוד ששולח התראה / אימייל / פוש
  },
  { connection: redisConnection }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});
