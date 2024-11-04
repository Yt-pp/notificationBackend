// src/messages/messages.controller.ts
import { Controller, Post, Body, Get, Query, Patch, Param, NotFoundException, UseGuards } from '@nestjs/common';
import { MessageDto } from '../dto/message.dto';
import { MessagesService } from './message.service';
import { JwtAuthGuard } from 'src/jwt-auth.guard';

@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    @Post('send')
    @UseGuards(JwtAuthGuard)
    async sendMessage(@Body() messageDto: MessageDto) {
        if (messageDto.broadcastToAll) {
            return this.messagesService.createBroadcastMessage(messageDto.content, messageDto.senderId);
        } else if (messageDto.recipientId) {
            return this.messagesService.createMessage(messageDto.content, messageDto.senderId, messageDto.recipientId);
        } else if (messageDto.group) {
            return this.messagesService.createGroupMessage(messageDto.content, messageDto.senderId, messageDto.group);
        }
        throw new Error('Invalid message parameters');
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getAllMessages(@Query('userId') userId: string) {
        const messages = await this.messagesService.getMessages(userId);
        if (!messages || messages.length === 0) {
            throw new NotFoundException('No messages found for this user');
        }
        return messages;
    }

    @Patch(':messageId/read')
    async markMessageAsRead(@Param('messageId') messageId: string, @Body('userId') userId: string) {
        const updatedMessage = await this.messagesService.markMessageAsRead(messageId, userId);
        if (!updatedMessage) {
            return { message: 'Message not found or user is not a recipient' };
        }
        return updatedMessage;
    }
}
