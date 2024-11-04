import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async validateUser(email: string, password: string) {
        
        const user = await this.usersService.findUserByEmail(email);
        console.log('User Password (hashed):', user.password); // Log hashed password
        console.log('Entered Password:', password); // Log entered password
        console.log('Types:', {
            hashed: typeof user.password,
            entered: typeof password
        }); // Log types
        if (user && await bcrypt.compare(password.trim(), user.password)) {
            return user; // Return user if credentials are valid
        }
        return null; // Return null if user is not found or password is invalid
    }

    async login(email: string, password: string, role = 'user') {
        const user = await this.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials'); // Throw error for invalid credentials
        }
        if (user.role !== role) {
            throw new ForbiddenException(`Access denied for ${role}`); // Throw error if role does not match
        }
        
        const payload = { email: user.email, sub: user._id };
        const accessToken = this.jwtService.sign(payload); // Generate JWT token
        
        return {
            statusCode: 200,
            message: 'Login successful',
            data: {
                access_token: accessToken,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                },
            },
        };
    }
}
