import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token, User } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { UserWithoutPassword, Tokens } from '@shared/interfaces';
import { UserService } from '@user/user.service';
import { add } from 'date-fns';
import { v4 } from 'uuid';

@Injectable()
export class TokenService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly jwtService: JwtService,
		private readonly userService: UserService,
	) {}

	async generateTokens(user: UserWithoutPassword, agent: string): Promise<Tokens> {
		const accessToken = this.jwtService.sign({ id: user.id, roles: user.roles, verificated: user.verificationStatus });
		const refreshToken = await this.getRefreshToken(user.id, agent);
		return { accessToken, refreshToken };
	}

	async getRefreshToken(userId: string, agent: string): Promise<Token> {
		const token = await this.prismaService.token.findFirst({ where: { userId, userAgent: agent } });
		return await this.prismaService.token.upsert({
			where: { token: token ? token.token : '' },
			update: {
				token: v4(),
				exp: add(new Date(), { months: 1 }),
			},
			create: {
				token: v4(),
				exp: add(new Date(), { months: 1 }),
				userId,
				userAgent: agent,
			},
		});
	}

	async refreshTokens(refreshToken: string, agent: string): Promise<Tokens> {
		const token = await this.prismaService.token.delete({ where: { token: refreshToken } });
		if (!token || new Date(token.exp) < new Date()) {
			throw new UnauthorizedException('Refresh token is invalid or expired');
		}
		const user = await this.userService.findOne(token.userId);
		if (!user) {
			throw new UnauthorizedException('User not found');
		}
		return await this.generateTokens(user, agent);
	}
}
