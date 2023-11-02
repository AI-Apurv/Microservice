import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from './jwt.service';
import { RegisterRequestDto, LoginRequestDto, ValidateRequestDto } from '../auth.dto';
import { Users } from '../auth.entity';
import { LoginResponse, RegisterResponse, ValidateResponse } from '../auth.pb';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Users.name)
    private readonly userModel: Model<Users>,
    private readonly jwtService: JwtService
  ) {}
  


  public async register(registerRequestDto: RegisterRequestDto): Promise<RegisterResponse> {
    let user: Users = await this.userModel.findOne({ where: { email: registerRequestDto.email } });
    if (user) {
      return { status: HttpStatus.CONFLICT, error: ['E-Mail already exists'] };
    }
    console.log(registerRequestDto,'+++++++++++++++++++++++++++++');
    console.log("inside the auth user--------->>>>>>",registerRequestDto.firstName, registerRequestDto.lastName, registerRequestDto.userName,registerRequestDto.email, registerRequestDto.password, registerRequestDto.contactNumber , registerRequestDto.address)
    const newUser = new this.userModel({
        firstName: registerRequestDto.firstName,
        lastName: registerRequestDto.lastName,
        userName: registerRequestDto.userName,
        email: registerRequestDto.email,
        password: await this.jwtService.encodePassword(registerRequestDto.password),
        contactNumber: registerRequestDto.contactNumber,
        address: registerRequestDto.address
      });
    await newUser.save();
    return { status: HttpStatus.CREATED, error: null };
  }



  public async login(loginRequestDto: LoginRequestDto): Promise<LoginResponse> {
    console.log("____________________________________________________",loginRequestDto.email);
    const user: Users = await this.userModel.findOne({ email: loginRequestDto.email } );
    console.log('LLLLLLLLLLLLLLLLLLLLLLLLLLLLLL',user);
    if (!user) {
      return { status: HttpStatus.NOT_FOUND, error: ['E-Mail not found'], token: null };
    }
    const isPasswordValid: Promise<boolean> = this.jwtService.isPasswordValid(loginRequestDto.password, user.password);
    if (!isPasswordValid) {
      return { status: HttpStatus.NOT_FOUND, error: ['Password wrong'], token: null };
    }
    const token: string = this.jwtService.generateToken(user);
    return { token, status: HttpStatus.OK, error: null };
  }



  public async validate(validateRequestDto: ValidateRequestDto): Promise<ValidateResponse> {
    const decoded: Users = await this.jwtService.verify(validateRequestDto.token);
    if (!decoded) {
      return { status: HttpStatus.FORBIDDEN, error: ['Token is invalid'], userId: null };
    }
    const user: Users = await this.jwtService.validateUser(decoded);
    if (!user) {
      return { status: HttpStatus.CONFLICT, error: ['User not found'], userId: null };
    }
    return { status: HttpStatus.OK, error: null, userId: decoded.id };
  }

 
}

