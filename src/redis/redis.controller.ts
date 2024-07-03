import { Controller, Get } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@shared/decorators';

@ApiTags('Redis')
@Public()
@Controller('redis')
export class RedisController {
	constructor(private readonly redisService: RedisService) {}

	@Get('test')
	async test() {
		await this.redisService.test();
	}
}
