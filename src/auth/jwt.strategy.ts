import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRepository } from "./user.repository";
import { User } from "./user.entity";

@Injectable() // JwtStrategy를 다른 곳에서 주입하여 사용할 수 있도록 하기 위해
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@InjectRepository(UserRepository)
		private userRepository: UserRepository
	) {
		super({
			secretOrKey: 'Secret1234', // 토큰 생성할 때 secret과 동일해야 함
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
		})
	}

	async validate(payload) {
		const { username } = payload;
		const user: User = await this.userRepository.findOne({ where: {username} });

		if (!user) {
			throw new UnauthorizedException();
		}

		return user;
	}
}
