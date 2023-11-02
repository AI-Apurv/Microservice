import { ValidateResponse } from './auth.pb';
export declare class AuthService {
    private svc;
    private readonly client;
    OnModuleInit(): void;
    validate(token: string): Promise<ValidateResponse>;
}
