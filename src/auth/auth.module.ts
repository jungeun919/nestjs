import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'Secret1234',
      signOptions: {
        expiresIn: 3600,
      }
    }),
		TypeOrmModule.forFeature([User]),
	],
  controllers: [AuthController],
  providers: [AuthService, UserRepository],
})
export class AuthModule {}
