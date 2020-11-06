import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';
import { NotValidEmail } from '../validators/exclude-yahoo.validator';
import { ValidPhoneNumber } from '../validators/mobile-phone.validator';
import { VerifyAccountDto } from './verify-account.dto';

export class ResendCodeDto extends VerifyAccountDto {}
