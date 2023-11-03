import { JwtService as Jwt } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { Users } from '../auth.entity';
export declare class JwtService {
    private readonly userModel;
    private readonly jwt;
    constructor(userModel: Model<Users>, jwt: Jwt);
    decode(token: string): Promise<unknown>;
    validateUser(decoded: any): Promise<Users | null>;
    generateToken(user: Users): string;
    isPasswordValid(password: string, userPassword: string): Promise<boolean>;
    encodePassword(password: string): Promise<string>;
    verify(token: string): Promise<any>;
}
