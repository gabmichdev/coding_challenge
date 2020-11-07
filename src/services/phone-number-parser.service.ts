import { Service } from 'typedi';
import { BadRequestError } from 'routing-controllers';
import { isMobilePhone } from 'class-validator';

@Service()
export class PhoneNumberParserService {
	private defaultCountryCode = '+52';

	parsePhoneNumber(phoneNumber: string): string {
		const cleanphoneNumber = this.getPhoneNumber(phoneNumber);
		if (cleanphoneNumber) {
			const countryCode = this.getCountryCode(cleanphoneNumber);
			if (countryCode && countryCode.length > 0) {
				return cleanphoneNumber.startsWith('+') ? cleanphoneNumber : '+' + cleanphoneNumber;
			} else {
				return this.defaultCountryCode + cleanphoneNumber;
			}
		} else {
			throw new BadRequestError('Invalid mobile phone entered');
		}
	}
	getPhoneNumber(phoneNumber: string): string | null {
		if (!phoneNumber) {
			return null;
		}
		phoneNumber = phoneNumber.replace(/[- ]/g, '');
		return isMobilePhone(phoneNumber) && phoneNumber.length >= 10 ? phoneNumber : null;
	}
	getCountryCode(cleanPhoneNumber: string): string | null {
		const indexEnd = cleanPhoneNumber.length - 10;
		const countryCode = cleanPhoneNumber.slice(0, indexEnd);
		return countryCode.length > 0 ? countryCode : null;
	}

	removeCountryCode(phoneNumber: string) {
		const countryCode = this.getCountryCode(phoneNumber)
		if (!countryCode) {
			return phoneNumber
		}
		return phoneNumber.replace(countryCode, '')
	}
}
