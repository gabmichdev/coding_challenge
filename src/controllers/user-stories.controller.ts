import { JsonController, Body, Post, OnUndefined, Params } from 'routing-controllers';
import Container from 'typedi';
import { ValidateVerificationCodeDto } from '../dto/check-code.dto';
import { ResendCodeDto } from '../dto/resend-code.dto';
import { VerifyAccountDto } from '../dto/verify-account.dto';
import { TwilioService } from '../services/twilio.service';
import config from 'config';

@JsonController('/user-stories/verification')
export class UserStoriesController {
	constructor(private twilioService = Container.get(TwilioService)) {
		this.twilioService.setCredentials(config.get('twilio'));
	}

	@OnUndefined(500)
	@Post('/send')
	async sendNewVerificationMessage(@Body() verifyAccountDto: VerifyAccountDto): Promise<object | undefined> {
		const { email, phoneNumber: phoneNumber } = verifyAccountDto;
		await this.twilioService.sendNewVerificationMessage(phoneNumber, email);
		return { messageSent: true };
	}

	@OnUndefined(500)
	@Post('/:code/validate')
	async checkVerificationCode(
		@Params() validateVerificationCodeDto: ValidateVerificationCodeDto,
		@Body() verifyAccoundDto: VerifyAccountDto
	): Promise<object> {
		const { code } = validateVerificationCodeDto;
		const { email, phoneNumber } = verifyAccoundDto;
		this.twilioService.validateVerificationCode(code, email, phoneNumber);
		return { messageSent: true };
	}

	@OnUndefined(500)
	@Post('/resend/:phoneNumber')
	async resendVerificationCode(@Params() resendCodeDto: ResendCodeDto): Promise<object> {
		const { phoneNumber } = resendCodeDto;
		this.twilioService.resendVerificationCode(phoneNumber);
		return { messageSent: true };
	}
}
