import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '@user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenModule } from 'src/token/token.module';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
	controllers: [AuthController],
	providers: [AuthService],
	imports: [PassportModule, UserModule, TokenModule, MailerModule],
})
export class AuthModule {}
