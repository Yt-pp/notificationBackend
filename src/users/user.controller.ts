import { Body, Controller, Get, Param, Post, Patch, HttpCode, HttpStatus , NotFoundException} from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(
        @Body('email') email: string,
        @Body('password') password: string,
        @Body('name') name: string,
        @Body('group') group: string,
        @Body('role') role: string,
    ): Promise<User> {
        return this.usersService.register(email, password, name, group, role);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllUsers(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Patch('update-fcm-token/:userId')
    @HttpCode(HttpStatus.OK)
    async updateFcmToken(
        @Param('userId') userId: string,
        @Body('fcmToken') fcmToken: string,
    ): Promise<User | null> {
        const updatedUser = await this.usersService.updateFcmToken(userId, fcmToken);
        if (!updatedUser) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }
        return updatedUser;
    }
}
