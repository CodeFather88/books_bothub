import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { GUARDS } from '@auth/guards';
import { JwtModule } from '@nestjs/jwt';
import { options } from '@auth/config';
import { MailerModule } from './mailer/mailer.module';
import { UtilsModule } from './utils/utils.module';

@Module({
	imports: [
		JwtModule.registerAsync(options()),
		ConfigModule.forRoot({ isGlobal: true }),
		UserModule,
		PrismaModule,
		AuthModule,
		MailerModule,
		UtilsModule,
	],
	controllers: [AppController],
	providers: [AppService, ...GUARDS],
})
export class AppModule {}
