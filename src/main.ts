import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { RedisService } from './redis/redis.service';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(cookieParser());
	const config = new DocumentBuilder()
		.addBearerAuth()
		.setTitle('Social network app')
		.setDescription('Документация REST API')
		.setVersion('1.0.0')
		.addTag('User')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('docs', app, document);

	await app.listen(3000);
}
bootstrap();
