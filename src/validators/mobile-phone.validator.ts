import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { getPhoneNumber } from '../utils/utilities';

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
					return getPhoneNumber(value) !== null;
				}
			}
		});
	};
}
