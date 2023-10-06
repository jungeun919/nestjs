import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export class AuthService {
	constructor(
		@InjectRepository(UserRepository)
		private userRepository: UserRepository,
		private jwtService: JwtService
	) {}

	async signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
		return this.userRepository.createUser(authCredentialDto);
	}

	async signIn(authCredentialDto: AuthCredentialDto): Promise<{accessToken: string}> {
		const { username, password } = authCredentialDto;
		// const user = await this.userRepository.findOne({ username });
		const user = await this.userRepository.findOne({ where: {username} });


		if (user && (await bcrypt.compare(password, user.password))) {
			// 유저 토큰 생성 (secret + payload)
			const payload = { username };
			const accessToken = await this.jwtService.sign(payload);

			return { accessToken };
		} else {
			throw new UnauthorizedException('login failed');
		}
	}
}
