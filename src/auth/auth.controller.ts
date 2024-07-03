import {
	Controller,
	Post,
	Body,
	Get,
	Res,
	HttpStatus,
	UnauthorizedException,
	InternalServerErrorException,
	Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Cookie, Public, UserAgent } from '@shared/decorators';
import { LoginDto, RegisterDto } from './dto';
import { TokenService } from 'src/token/token.service';
import { Tokens } from '@shared/interfaces';
import { UserService } from '@user/user.service';

const REFRESH_TOKEN = 'refreshtoken';
@ApiTags('Authorization')
@Public()
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
		private readonly tokenService: TokenService,
		private readonly userService: UserService,
	) {}

	@Public()
	@ApiOperation({ summary: 'login' })
	@Post('login')
	async login(@Body() dto: LoginDto, @Res() res: Response, @UserAgent() agent: string) {
		console.log(agent);
		const tokens = await this.authService.login(dto, agent);
		if (!tokens) {
			throw new InternalServerErrorException('Failed to login');
		}
		await this.setRefreshTokenToCookies(tokens, res);
		res.status(HttpStatus.OK).json({ accessToken: tokens.accessToken });
	}

	@ApiOperation({ summary: 'register' })
	@Post('register')
	async register(@Body() dto: RegisterDto, @Res() res: Response, @UserAgent() agent: string) {
		const tokens = await this.authService.register(dto, agent);
		await this.setRefreshTokenToCookies(tokens, res);
		res.status(HttpStatus.OK).json({ accessToken: tokens.accessToken });
	}

	@ApiOperation({ summary: 'refresh-tokens' })
	@Get('refresh-tokens')
	async refreshTokens(@Cookie(REFRESH_TOKEN) refreshToken: string, @Res() res: Response, @UserAgent() agent: string) {
		if (!refreshToken) {
			throw new UnauthorizedException('Refresh token is required');
		}
		const tokens = await this.tokenService.refreshTokens(refreshToken, agent);
		if (!tokens) {
			throw new UnauthorizedException('Invalid refresh token');
		}
		await this.setRefreshTokenToCookies(tokens, res);
		res.status(HttpStatus.OK).json({ accessToken: tokens.accessToken });
	}

	@ApiOperation({ summary: 'confirm-mail' })
	@Get('confirm-mail/:link')
	async confirmMail(@Req() req: Request, @Res() res: Response) {
		const link = req.params.link;
		const result = await this.userService.confirmMail(link);
		res.status(HttpStatus.OK).json({ result });
	}

	private async setRefreshTokenToCookies(tokens: Tokens, res: Response) {
		if (!tokens) {
			throw new UnauthorizedException();
		}
		res.cookie(REFRESH_TOKEN, tokens.refreshToken.token, {
			httpOnly: true,
			sameSite: 'lax',
			expires: new Date(tokens.refreshToken.exp),
			secure: this.configService.get('NODE_ENV', 'development') === 'production',
			path: '/',
		});
	}
}
