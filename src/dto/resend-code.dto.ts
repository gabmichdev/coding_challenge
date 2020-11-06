import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { NotValidEmail } from '../validators/exclude-yahoo.validator';
import { ValidPhoneNumber } from '../validators/mobile-phone.validator';
import { VerifyAccountDto } from './verify-account.dto';

export class ResendCodeDto {
	@IsNotEmpty()
	@ValidPhoneNumber({ message: 'The mobile phone is invalid' })
	phoneNumber: string;
}
