import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        console.log('JwtAuthGuard: canActivate called');
        
        const token = this.extractTokenFromHeader(request);
        console.log('Token:', token);

        if (!token) {
            console.log('No token provided');
            throw new UnauthorizedException('No token provided');
        }

        // Call the base class canActivate method to validate the token
        return super.canActivate(context) as Promise<boolean>;
    }

    extractTokenFromHeader(request: any): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
