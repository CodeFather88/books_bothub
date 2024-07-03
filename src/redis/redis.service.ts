import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClientType, createClient } from 'redis';

@Injectable()
export class RedisService {
	private client: RedisClientType;
	private url: string;
	// post:
	constructor(private readonly configService: ConfigService) {
		this.url = configService.get<string>('REDIS_URL');
		this.client = createClient({
			url: this.url,
		});

		this;

		this.client.connect().catch(console.error);
	}

	test = async () => {
		await this.client.set('key', 'value');
		const value = await this.client.get('key');
		console.log(value);
	};
}
