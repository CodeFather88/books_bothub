import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, Length } from 'class-validator';

export class CreateUserDto {
	@ApiProperty({ example: 'user@mail.ru', description: 'Почта' })
	@IsString({ message: 'Должно быть строкой' })
	@IsEmail({}, { message: 'некорректный email' })
	readonly email: string;
	@ApiProperty({ example: '12345678', description: 'Пароль' })
	@IsString({ message: 'Должно быть строкой' })
	@Length(4, 16, { message: 'от 4 до 16 символов' })
	readonly password: string;
	@ApiProperty({ example: 'Иван', description: 'Имя' })
	@IsString({ message: 'Должно быть строкой' })
	@Length(4, 16, { message: 'от 1 до 30 символов' })
	readonly username: string;
}
