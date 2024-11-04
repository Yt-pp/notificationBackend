import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from './users/user.service'; // Adjust the import path as needed

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: "G7^kz8@hY3e!LmX9#u2R9&nD7t!o3Vf6",
        });
    }

    async validate(payload) {
        console.log('Validating user with payload:', payload);
        const user = await this.usersService.getUserById(payload.sub);
        console.log('User found:', user);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
