import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';
import { NotValidEmail } from '../validators/exclude-yahoo.validator';
import { ValidPhoneNumber } from '../validators/mobile-phone.validator';

export class VerifyAccountDto {
	@IsEmail()
	@NotValidEmail({message: 'Your account must be a Rever Score address'})
	email: string;

	
	@ValidPhoneNumber({message: 'The mobile phone is invalid'})
	phoneNumber: string;
}