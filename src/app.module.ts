import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { MessagesModule } from './messages/message.module';



@Module({
    imports: [
        MongooseModule.forRoot("mongodb+srv://teoyutong28:yutong2802@cluster0.v1k7f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"), // Use environment variable for MongoDB URI
        UsersModule,
        MessagesModule,
        AuthModule,
    ],
})
export class AppModule {}
