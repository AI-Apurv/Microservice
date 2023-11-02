import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UserSchema, Users } from './auth.entity';
import { AuthService } from './service/auth.service';
import { JwtService } from './service/jwt.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    JwtModule.register({
      secret: 'user-secret-key',
      signOptions: { expiresIn: '365d' },
    }),
    MongooseModule.forFeature([
      {name: 'Users', schema: UserSchema}
    ])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, JwtStrategy],
})
export class AuthModule {}


