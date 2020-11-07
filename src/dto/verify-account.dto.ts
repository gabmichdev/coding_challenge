import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { NotValidEmail } from '../validators/exclude-yahoo.validator';
import { ValidPhoneNumber } from '../validators/phone-number.validator';

export class VerifyAccountDto {
	@IsEmail()
	@NotValidEmail({message: 'Your account must be a Rever Score address'})
	email: string;

	@IsNotEmpty()
	@ValidPhoneNumber({message: 'The mobile phone is invalid'})
	phoneNumber: string;
}