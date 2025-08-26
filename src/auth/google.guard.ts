import { Injectable, UnauthorizedException, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GoogleGuard extends AuthGuard('google') {
    constructor() {
        super({
            accessType: 'offline',
        });
    }
    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
        if (err) {
            throw err;
        }

        if (!user) {
            throw new UnauthorizedException(info?.message || 'Authentication with Google failed');
        }

        return user;
    }
}