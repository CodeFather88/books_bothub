import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class DeleteUserDto {
	@IsUUID()
	@ApiProperty({ description: 'ID пользователя', example: 'uuid' })
	id: string;
}
