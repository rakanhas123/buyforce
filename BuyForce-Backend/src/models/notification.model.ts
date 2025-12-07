import mongoose, { Schema } from 'mongoose';

const notificationSchema = new Schema({
	userId: { type: String, required: true },
	type: { type: String, required: true },
	title: { type: String, required: true },
	body: { type: String, required: true },
	channel: { type: String, required: true },
	read: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now }
});

export const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
