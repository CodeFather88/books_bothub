import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
	@ApiProperty({ example: 'user@mail.ru', description: 'Email by user' })
	@IsEmail()
	email: string;
	@ApiProperty({ example: '12345678', description: 'Password by user' })
	@IsString()
	password: string;
}
