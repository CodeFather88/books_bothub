import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
	@ApiProperty({ example: 'user@mail.ru', description: 'Email by user' })
	@IsEmail()
	email: string;
	@ApiProperty({ example: '12345678', description: 'Password by user' })
	@IsString()
	@MinLength(6)
	password: string;
	@ApiProperty({ example: 'Иван', description: 'Username by user' })
	@IsString()
	@MinLength(6)
	username: string;
}
