import { Model } from 'mongoose';
import { JwtService } from './jwt.service';
import { RegisterRequestDto, LoginRequestDto, ValidateRequestDto } from '../auth.dto';
import { Users } from '../auth.entity';
import { LoginResponse, RegisterResponse, ValidateResponse } from '../auth.pb';
export declare class AuthService {
    private readonly userModel;
    private readonly jwtService;
    constructor(userModel: Model<Users>, jwtService: JwtService);
    register(registerRequestDto: RegisterRequestDto): Promise<RegisterResponse>;
    login(loginRequestDto: LoginRequestDto): Promise<LoginResponse>;
    validate(validateRequestDto: ValidateRequestDto): Promise<ValidateResponse>;
}
