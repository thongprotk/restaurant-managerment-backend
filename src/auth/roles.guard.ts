import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean {
        const required = this.reflector.get<string[]>('roles', context.getHandler()) ||
            this.reflector.get<string[]>('roles', context.getClass());
        if (!required || required.length === 0) {
            return true;

        }
        const req = context.switchToHttp().getRequest();
        const user = req.user;
        return user && required.some(r => (user.roles || []).includes(r));
    }

}