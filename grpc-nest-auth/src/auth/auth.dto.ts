import { IsEmail, IsString, MinLength } from 'class-validator';
import { LoginRequest, RegisterRequest, ValidateRequest } from './auth.pb';

export class LoginRequestDto implements LoginRequest {
  @IsEmail()
  public readonly email: string;

  @IsString()
  public readonly password: string;
}

export class RegisterRequestDto implements RegisterRequest {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  contactNumber: string;
  address: string;
}

export class ValidateRequestDto implements ValidateRequest {
  @IsString()
  public readonly token: string;
}

