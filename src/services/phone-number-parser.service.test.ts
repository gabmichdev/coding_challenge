import { expect } from 'chai';
import { PhoneNumberParserService } from './phone-number-parser.service';

let phoneNumberParserService: PhoneNumberParserService;
let testPhoneNumbers: string[];

describe('Phone Number Parser Service', () => {
	beforeEach(() => {
		phoneNumberParserService = new PhoneNumberParserService();
		testPhoneNumbers = '12-3456-7890,1234567890,12 3456 7890,+52-12-3456-7890,+521234567890,+52 12 3456 7890'.split(
			','
		);
	});
	it('Should get the country code of all phones that have one', () => {
		const expectedCountryCode = '+52';
		testPhoneNumbers.forEach((phoneNumber: string) => {
			const cleanPhoneNumber = phoneNumberParserService.parsePhoneNumber(phoneNumber);
			const countryCode = phoneNumberParserService.getCountryCode(cleanPhoneNumber);
			if (phoneNumber.startsWith(expectedCountryCode)) {
				expect(expectedCountryCode).to.equal(countryCode);
			}
		});
	});
	it('Should get the same phone number no matter how the phone number is formatted', () => {
		const expectedPhoneNumber = '1234567890';
		testPhoneNumbers.forEach((phoneNumber: string) => {
			const cleanPhoneNumber = phoneNumberParserService.parsePhoneNumber(phoneNumber);
			const noCountryCodeNumber = phoneNumberParserService.removeCountryCode(cleanPhoneNumber);
			expect(noCountryCodeNumber).to.equal(expectedPhoneNumber);
		});
	});
});
