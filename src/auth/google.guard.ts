import { Injectable, UnauthorizedException, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GoogleGuard extends AuthGuard('google') {
    constructor() {
        super({
            accessType: 'offline',
        });
    }
    // handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    //     // If passport produced an error, surface it
    //     if (err) {
    //         throw err;
    //     }

    //     // When no user (e.g. auth failed), throw a proper UnauthorizedException
    //     if (!user) {
    //         // You can inspect `info` for details and map messages if desired
    //         throw new UnauthorizedException(info?.message || 'Authentication with Google failed');
    //     }

    //     // Successful authentication, return the user (attached to request later)
    //     return user;
    // }
}