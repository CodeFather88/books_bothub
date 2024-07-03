import { Body, Controller, Delete, Get, Param, Post, Headers } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteUserDto } from './dto/deleteUser.dto';
import { Role } from '@shared/enums';
import { CurrentUser, Roles } from '@shared/decorators';
import { JwtPayload } from '@shared/interfaces';

@ApiTags('User')
@ApiBearerAuth()
@Roles(Role.ADMIN)
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiOperation({ summary: 'get one user by token (for USER)' })
	@Get('getByToken')
	async getOneUser(@CurrentUser() user: JwtPayload) {
		return await this.userService.findOne(user.id);
	}

	@ApiOperation({ summary: 'Delete user by token (for USER)' })
	@Delete('deleteByToken')
	async deleteUserByToken(@CurrentUser() user: JwtPayload) {
		return await this.userService.delete(user.id);
	}

	@ApiOperation({ summary: 'Delete user by id (for ADMIN)' })
	@Delete('deleteById')
	@Roles(Role.ADMIN)
	async deleteUserById(@Param() dto: DeleteUserDto) {
		return await this.userService.delete(dto.id);
	}

	@ApiOperation({ summary: 'Create user (for ADMIN)' })
	@Post()
	@Roles(Role.ADMIN)
	async createUser(@Body() dto: CreateUserDto) {
		return await this.userService.create(dto);
	}

	@ApiOperation({ summary: 'get all users(for ADMIN)' })
	@Get('getAll')
	async getAllUsers() {
		return await this.userService.findAll();
	}
}
