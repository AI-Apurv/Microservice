import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from './auth.service';
export declare class AuthGuard implements CanActivate {
    readonly service: AuthService;
    canActivate(ctx: ExecutionContext): Promise<boolean> | never;
}
