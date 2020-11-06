import Container, { Service } from 'typedi';
import config from 'config';
import twilio from 'twilio';
import { CodeGeneratorService } from './code-generator.service';
import { getCountryCode, getPhoneNumber, parseMessage } from '../utils/utilities';
import { GenericError } from '../interfaces/responses';
import { BadRequestError } from 'routing-controllers';

interface TwilioConfig {
	accountSid: string;
	token: string;
	phoneNumber: string;
}
enum messages {
	SEND_VERIFICATION_CODE = 'Hi {email}! Your verification code for Rever is {code}. We are sending you this notification through our {messageMechanism} subsystem.',
	CHECK_CODE = 'Hi {email}, you have been verified!',
	NO_MATCH = 'Hi {email}! The verification code does not match the one we sent you. Please try again.',
	RESEND_CODE = 'Here is your Rever verification code! {code}.',
	RESEND_CODE_ERROR = 'Verification code not found!'
}
enum messageMechanism {
	SMS = 'SMS',
	CONSOLE = 'Console'
}

const twilioConfig: TwilioConfig = config.get('twilio');

@Service()
export class TwilioService {
	private defaultCountryCode = '+52';
	constructor(private phoneNumber = twilioConfig.phoneNumber, private codeGeneratorService: CodeGeneratorService) {
		this.phoneNumber;
		this.codeGeneratorService = Container.get(CodeGeneratorService);
	}

	async sendNewVerificationMessage(to: string, email: string) {
		const preparedphoneNumber = this.preparephoneNumber(to);
		const code = this.codeGeneratorService.generateCode(email, preparedphoneNumber);
		try {
			await this.sendMessage(
				preparedphoneNumber,
				messages.SEND_VERIFICATION_CODE,
				{
					email,
					code,
					messageMechanism: messageMechanism.SMS
				},
				messageMechanism.SMS
			);
		} catch (err) {
			console.log(err.message);
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
			const preparedphoneNumber = this.preparephoneNumber(phoneNumber);
			let codeInfo = this.codeGeneratorService.getCodeInfo(code, email, preparedphoneNumber);
			if (codeInfo) {
				codeInfo.verified = true;
				await this.sendMessage(preparedphoneNumber, messages.CHECK_CODE, { email }, messageMechanism.SMS);
			} else {
				await this.sendMessage(preparedphoneNumber, messages.NO_MATCH, { email }, messageMechanism.SMS);
			}
		} catch (err) {
			console.log(err.message);
			const preparedphoneNumber = this.preparephoneNumber(phoneNumber);
			const codeInfo = this.codeGeneratorService.getCodeInfo(code, email, preparedphoneNumber);
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
			const preparedphoneNumber = this.preparephoneNumber(phoneNumber);
			let codeInfo = this.codeGeneratorService.getCodeInfo(undefined, undefined, preparedphoneNumber);
			if (codeInfo) {
				codeInfo.verified = true;
				await this.sendMessage(
					preparedphoneNumber,
					messages.RESEND_CODE,
					{ code: codeInfo.code },
					messageMechanism.SMS
				);
			} else {
				await this.sendMessage(preparedphoneNumber, messages.RESEND_CODE_ERROR, {}, messageMechanism.SMS);
			}
		} catch (err) {
			console.log(err.message);
			const preparedphoneNumber = this.preparephoneNumber(phoneNumber);
			const codeInfo = this.codeGeneratorService.getCodeInfo(undefined, undefined, preparedphoneNumber);
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

	private preparephoneNumber(phoneNumber: string) {
		const cleanphoneNumber = getPhoneNumber(phoneNumber);
		if (cleanphoneNumber) {
			console.log(cleanphoneNumber);
			const countryCode = getCountryCode(cleanphoneNumber);
			console.table({ countryCode, cleanphoneNumber });
			if (countryCode && countryCode.length > 0) {
				return cleanphoneNumber.startsWith('+') ? cleanphoneNumber : '+' + cleanphoneNumber;
			} else {
				return this.defaultCountryCode + cleanphoneNumber;
			}
		} else {
			throw new BadRequestError('Invalid mobile phone entered');
		}
	}

	private async sendMessage(to: string, message: string, fields: any, through: string = messageMechanism.SMS) {
		try {
			const parsedMessage = parseMessage(message, fields) as string;
			if (through === messageMechanism.SMS) {
				const client = twilio(twilioConfig.accountSid, twilioConfig.token);
				await client.messages.create({
					to,
					body: parsedMessage,
					from: this.phoneNumber
				});
			} else {
				console.log(parsedMessage);
			}
			
		} catch (err) {
			console.log(err);
			throw new GenericError(500, 'An error has ocurred when trying to send SMS!');
		}
	}
}
