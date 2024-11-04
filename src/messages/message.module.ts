import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/user.module';
import { AuthModule } from '../auth/auth.module';
import { Message, MessageSchema } from './shcemas/message.schema';
import { MessagesController } from './message.controller';
import { MessagesService } from './message.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
        UsersModule,
        AuthModule,
    ],
    controllers: [MessagesController],
    providers: [MessagesService],
})
export class MessagesModule {}
