import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { options } from '@auth/config';
import { UserService } from '@user/user.service';
import { UserModule } from '@user/user.module';

@Module({
	imports: [JwtModule.registerAsync(options()), UserModule],
	providers: [TokenService],
	exports: [TokenService],
})
export class TokenModule {}
