import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './user.service';
import { UserSchema } from './schemas/user.schema';
import { UsersController } from './user.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]) // Registering the User schema
    ],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService], // Optionally export the service for use in other modules
})
export class UsersModule {}
