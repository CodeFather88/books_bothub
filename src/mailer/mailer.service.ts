import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
	private transporter: Transporter;
	private user: string; // email
	private host: string;
	private port: number;
	private pass: string; // пароль

	constructor(private readonly configService: ConfigService) {
		this.user = this.configService.get<string>('MAIL_USER');
		this.host = this.configService.get<string>('MAIL_HOST');
		this.port = parseInt(this.configService.get<string>('MAIL_PORT'), 10); // convert port to number
		this.pass = this.configService.get<string>('MAIL_PASSWORD');

		this.transporter = nodemailer.createTransport({
			host: this.host,
			port: this.port,
			secure: false,
			auth: {
				user: this.user,
				pass: this.pass,
			},
		});
	}

	async sendMail(to: string, link: string) {
		const API_URL = this.configService.get('API_URL');
		const fullVerificationLink = `${API_URL}/auth/confirm-mail/${link}`;
		const mailOptions = {
			from: this.user,
			to,
			html: `
                    <div>
                        <h1>Для активации перейдите по ссылке</h1>
                        <a href="${fullVerificationLink}">${fullVerificationLink}</a>
                    </div>
                `,
		};

		return await this.transporter.sendMail(mailOptions);
	}
}
