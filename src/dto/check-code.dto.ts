import { NotValidEmail } from '../validators/exclude-yahoo.validator';
import { IsReverScoreCode } from '../validators/is-rever-score-code.validator';
import { VerifyAccountDto } from './verify-account.dto';

export class ValidateVerificationCodeDto {
	@IsReverScoreCode({ message: 'This is not a valid Rever Score verification code' })
	code: string;
}
