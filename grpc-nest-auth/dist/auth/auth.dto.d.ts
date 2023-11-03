import { LoginRequest, RegisterRequest, ValidateRequest } from './auth.pb';
export declare class LoginRequestDto implements LoginRequest {
    readonly email: string;
    readonly password: string;
}
export declare class RegisterRequestDto implements RegisterRequest {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    contactNumber: string;
    address: string;
}
export declare class ValidateRequestDto implements ValidateRequest {
    readonly token: string;
}
