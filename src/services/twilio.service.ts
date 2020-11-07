import Container, { Service } from 'typedi';
import config from 'config';
import twilio from 'twilio';
import { CodeGeneratorService } from './code-generator.service';
import { parseMessage } from '../utils/message-parser';
import { GenericError } from '../interfaces/responses';
import { BadRequestError } from 'routing-controllers';
import { PhoneNumberParserService } from './phone-number-parser.service';

export interface TwilioConfig {
	accountSid: string;
	token: string;
	phoneNumber?: string;
}
export enum messages {
	SEND_VERIFICATION_CODE = 'Hi {email}! Your verification code for Rever is {code}. We are sending you this notification through our {messageMechanism} subsystem.',
	CHECK_CODE = 'Hi {email}, you have been verified!',
	NO_MATCH = 'Hi {email}! The verification code does not match the one we sent you. Please try again.',
	RESEND_CODE = 'Here is your Rever verification code! {code}.',
	RESEND_CODE_ERROR = 'Verification code not found!'
}
export enum messageMechanism {
	SMS = 'SMS',
	CONSOLE = 'Console'
}

const twilioConfig: TwilioConfig = config.get('twilio');

@Service()
export class TwilioService {
	credentials: TwilioConfig;
	constructor(
		public phoneNumber = twilioConfig.phoneNumber,
		public codeGeneratorService: CodeGeneratorService,
		public phoneNumberParserService: PhoneNumberParserService
	) {
		this.phoneNumber;
		this.codeGeneratorService = Container.get(CodeGeneratorService);
	}

	async sendNewVerificationMessage(to: string, email: string): Promise<void> {
		const preparedphoneNumber = this.phoneNumberParserService.parsePhoneNumber(to);
		const code = this.codeGeneratorService.generateCode(email, preparedphoneNumber);
		try {
			await this.sendMessage(preparedphoneNumber, messages.SEND_VERIFICATION_CODE, {
				email,
				code,
				messageMechanism: messageMechanism.SMS
			});
		} catch (err) {
			this.sendMessage(
				preparedphoneNumber,
				messages.SEND_VERIFICATION_CODE,
				{
					email,
					code,
					messageMechanism: messageMechanism.CONSOLE
				},
				messageMechanism.CONSOLE
			);
		}
	}

	async validateVerificationCode(code: string, email: string, phoneNumber: string) {
		try {
			const preparedphoneNumber = this.phoneNumberParserService.parsePhoneNumber(phoneNumber);
			let codeInfo = this.codeGeneratorService.getCodeInfo(code, preparedphoneNumber);
			if (codeInfo) {
				codeInfo.verified = true;
				await this.sendMessage(preparedphoneNumber, messages.CHECK_CODE, { email });
			} else {
				await this.sendMessage(preparedphoneNumber, messages.NO_MATCH, { email });
			}
		} catch (err) {
			const preparedphoneNumber = this.phoneNumberParserService.parsePhoneNumber(phoneNumber);
			const codeInfo = this.codeGeneratorService.getCodeInfo(code, preparedphoneNumber);
			if (codeInfo) {
				codeInfo.verified = true;
				this.sendMessage(preparedphoneNumber, messages.CHECK_CODE, { email }, messageMechanism.CONSOLE);
			} else {
				this.sendMessage(preparedphoneNumber, messages.NO_MATCH, { email }, messageMechanism.CONSOLE);
			}
		}
	}

	async resendVerificationCode(phoneNumber: string) {
		try {
			const preparedphoneNumber = this.phoneNumberParserService.parsePhoneNumber(phoneNumber);
			let codeInfo = this.codeGeneratorService.getCodeInfo(undefined, preparedphoneNumber);
			if (codeInfo) {
				codeInfo.verified = true;
				await this.sendMessage(preparedphoneNumber, messages.RESEND_CODE, { code: codeInfo.code });
			} else {
				await this.sendMessage(preparedphoneNumber, messages.RESEND_CODE_ERROR, {}, messageMechanism.SMS);
			}
		} catch (err) {
			const preparedphoneNumber = this.phoneNumberParserService.parsePhoneNumber(phoneNumber);
			const codeInfo = this.codeGeneratorService.getCodeInfo(undefined, preparedphoneNumber);
			if (codeInfo) {
				codeInfo.verified = true;
				this.sendMessage(
					preparedphoneNumber,
					messages.RESEND_CODE,
					{ code: codeInfo.code },
					messageMechanism.CONSOLE
				);
			} else {
				this.sendMessage(preparedphoneNumber, messages.RESEND_CODE_ERROR, {}, messageMechanism.CONSOLE);
			}
		}
	}

	async getClient() {
		try {
			return twilio(this.credentials.accountSid, this.credentials.token);
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	setCredentials(credentials: TwilioConfig) {
		this.credentials = credentials;
	}

	async sendMessage(to: string, message: string, fields: any, through: string = messageMechanism.SMS) {
		try {
			const parsedMessage = parseMessage(message, fields) as string;
			const client = await this.getClient();
			if (through === messageMechanism.SMS && client) {
				await client.messages.create({
					to,
					body: parsedMessage,
					from: this.phoneNumber
				});
			} else {
				console.log(parsedMessage);
			}
		} catch (err) {
			throw new GenericError(500, 'An error has ocurred when trying to send SMS!');
		}
	}
}
