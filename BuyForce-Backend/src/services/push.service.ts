import axios from "axios";

export async function sendPushNotification(token: string, title: string, body: string) {
  console.log('Push sent:', title, body);
  await axios.post(
    "https://fcm.googleapis.com/fcm/send",
    {
      to: token,
      notification: {
        title,
        body
      }
    },
    {
      headers: {
        Authorization: `key=${process.env.FCM_aSERVER_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );
}
