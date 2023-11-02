import { Injectable } from '@nestjs/common';
import { JwtService as Jwt } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import {Model} from 'mongoose';
import { Users } from '../auth.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class JwtService {
  private readonly jwt:Jwt
  constructor(

    @InjectModel(Users.name)
    private readonly userModel: Model<Users>,
    jwt:Jwt
  ) {
    this.jwt = jwt
  }

  // Decoding the JWT Token
  public async decode(token: string): Promise<unknown> {
    return this.jwt.decode(token, null);
  }

  // Get User by User ID we get from decode()
  public async validateUser(decoded: any): Promise<Users | null> {
    return this.userModel.findOne(decoded.id).exec();
  }

  // Generate JWT Token
  public generateToken(user: Users): string {
    return this.jwt.sign({  id: user._id, email: user.email });
  }

  // Validate User's password
  public isPasswordValid(password: string, userPassword: string): Promise<boolean>{
    return bcrypt.compare(password, userPassword);
  }

  // Encode User's password
  public async encodePassword(password: string): Promise<string> {
    const salt: string = await bcrypt.genSalt(10);
    return bcrypt.hash(password,salt);
  }

  // Validate JWT Token, throw forbidden error if JWT Token is invalid
  public async verify(token: string): Promise<any> {
    try {
      return this.jwt.verify(token);
    } catch (err) {
        throw new Error('Invalid token');
    }
  }
}

