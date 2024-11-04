import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from '../users/user.service';
import { Message } from './shcemas/message.schema';
import { firebaseAdmin } from 'src/firebase/firebase-config';

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel(Message.name) private messageModel: Model<Message>,
        private usersService: UsersService
    ) {}

    async createMessage(content: string, senderId: string, recipientId?: string, broadcastToAll?: boolean, group?: string) {
        if (broadcastToAll) {
            return this.createBroadcastMessage(content, senderId);
        } else if (group) {
            return this.createGroupMessage(content, senderId, group);
        } else if (recipientId) {
            const newMessage = new this.messageModel({
                content,
                senderId,
                recipients: [{ userId: recipientId, isRead: false }],
            });
            await newMessage.save();
            await this.sendPushNotification(recipientId, content, senderId);
            return [newMessage];
        } else {
            throw new Error('No valid recipient or broadcast option provided');
        }
    }

    async createBroadcastMessage(content: string, senderId: string) {
        const allUsers = await this.usersService.findAll();
        const messages = [];
        for (const user of allUsers) {
            const newMessage = new this.messageModel({
                content,
                senderId,
                recipients: [{ userId: user._id.toString(), isRead: false }],
            });
            messages.push(await newMessage.save());
            await this.sendPushNotification(user._id.toString(), content, senderId);
        }
        return messages;
    }

    async createGroupMessage(content: string, senderId: string, group: string) {
        const groupMembers = await this.usersService.findUsersByGroup(group);
        const messages = [];
        for (const user of groupMembers) {
            const newMessage = new this.messageModel({
                content,
                senderId,
                recipients: [{ userId: user._id.toString(), isRead: false }],
            });
            messages.push(await newMessage.save());
            await this.sendPushNotification(user._id.toString(), content, senderId);
        }
        return messages;
    }

    async markMessageAsRead(messageId: string, userId: string) {
        const message = await this.messageModel.findOneAndUpdate(
            { _id: messageId, 'recipients.userId': userId },
            { $set: { 'recipients.$.isRead': true } },
            { new: true }
        );
        return message;
    }

    async getMessages(userId: string) {
        const messages = await this.messageModel.find({
            recipients: { $elemMatch: { userId } }
        }).exec();
        return messages.map((message) => {
            const relevantRecipient = message.recipients.find(recipient => recipient.userId === userId);
            return {
                ...message.toObject(),
                recipients: [relevantRecipient]
            };
        });
    }

    async sendPushNotification(recipientId: string, messageContent: string, senderId: string) {
        const recipientToken = await this.getUserFcmToken(recipientId);
        if (recipientToken) {
            const message = {
                data: {
                    title: `New message from ${senderId}`,
                    body: messageContent,
                },
                token: recipientToken,
            };
            try {
                const response = await firebaseAdmin.messaging().send(message);
                console.log(`Successfully sent push notification: ${response}`);
            } catch (error) {
                console.error('Error sending push notification:', error);
            }
        } else {
            console.warn(`No FCM token found for recipient ID: ${recipientId}`);
        }
    }

    async getUserFcmToken(userId: string) {
        const user = await this.usersService.getUserById(userId);
        return user ? user.fcmToken : null;
    }
}
