import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '@user/user.service';
import { LoginDto } from './dto/login.dto';
import { compareSync } from 'bcrypt';
import { TokenService } from 'src/token/token.service';
import { Tokens } from '@shared/interfaces';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly tokenService: TokenService,
		private readonly mailerService: MailerService,
	) {}

	async testmail() {
		return null;
		// return await this.mailerService.sendMail('lolkek0v7777@gmail.com', );
	}

	async register(dto: RegisterDto, agent: string) {
		const newUser = await this.userService.create(dto);
		if (!newUser) {
			throw new ConflictException('Invalid email or password');
		}
		const { email, verificationLink } = newUser;
		await this.mailerService.sendMail(email, verificationLink);
		const tokens = await this.tokenService.generateTokens(newUser, agent);
		if (!tokens) {
			throw new InternalServerErrorException('Failed to register');
		}
		return tokens;
	}

	async login(dto: LoginDto, agent: string): Promise<Tokens> {
		const user = await this.userService.findOne(dto.email);
		if (!user || !compareSync(dto.password, user.password)) {
			throw new UnauthorizedException('Invalid email or password');
		}
		return await this.tokenService.generateTokens(user, agent);
	}
}
