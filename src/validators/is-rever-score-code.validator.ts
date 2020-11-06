import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { getPhoneNumber } from '../utils/utilities';

export function IsReverScoreCode(validationOptions?: ValidationOptions) {
	return (object: any, propertyName: string) => {
		registerDecorator({
			name: 'IsReverScoreCode',
			target: object.constructor,
			propertyName,
			constraints: [],
			options: validationOptions,
			validator: {
				validate(value: string, args: ValidationArguments) {
					const valueLength = value.length;
					const options = [ 4, 6, 8 ];
					if (!options.includes(valueLength)) {
						return false;
					}
					return true;
				}
			}
		});
	};
}
