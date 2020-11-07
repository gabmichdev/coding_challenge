import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { PhoneNumberParserService } from '../services/phone-number-parser.service';

export function ValidPhoneNumber(validationOptions?: ValidationOptions) {
	return (object: any, propertyName: string) => {
		registerDecorator({
			name: 'ValidPhoneNumber',
			target: object.constructor,
			propertyName,
			constraints: [],
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
					return new PhoneNumberParserService().getPhoneNumber(value) !== null;
				}
			}
		});
	};
}
