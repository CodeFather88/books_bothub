import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { genSalt, hash } from 'bcrypt';
import { CreateUserDto } from './dto/createUser.dto';
import { RegisterDto } from '@auth/dto';

@Injectable()
export class UserService {
	constructor(private readonly prismaService: PrismaService) {}

	async create(user: RegisterDto) {
		const hashedPassword = await this.hashPassword(user.password);
		const newUser = await this.prismaService.user
			.create({
				data: {
					username: user.username,
					email: user.email,
					password: hashedPassword,
				},
				select: {
					id: true,
					email: true,
					createdAt: true,
					updatedAt: true,
					roles: true,
					verificationLink: true,
					verificationStatus: true,
					password: false,
				},
			})
			.catch((e) => {
				console.log(e);
			});
		if (!newUser) {
			throw new ConflictException('User already exists');
		}
		return newUser;
	}

	async findOne(idOrEmail: string): Promise<User> {
		const user = await this.prismaService.user.findFirst({
			where: {
				OR: [{ id: idOrEmail }, { email: idOrEmail }],
			},
		});
		return user;
	}

	async delete(id: string) {
		await this.prismaService.user.delete({ where: { id } });
		return { status: 'ok' };
	}

	async findAll(): Promise<User[]> {
		const users = await this.prismaService.user.findMany();
		return users;
	}

	async confirmMail(verificationLink: string) {
		return await this.prismaService.user.update({
			where: {
				verificationLink,
			},
			data: {
				verificationStatus: true,
			},
			select: {
				password: false,
				email: true,
				verificationStatus: true,
			},
		});
	}

	private async hashPassword(password: string): Promise<string> {
		const salt = await genSalt(10);
		return await hash(password, salt);
	}
}
