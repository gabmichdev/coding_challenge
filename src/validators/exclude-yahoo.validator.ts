import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function NotValidEmail(validationOptions?: ValidationOptions) {
	return (object: any, propertyName: string) => {
		registerDecorator({
			name: 'NotYahooEmail',
			target: object.constructor,
			propertyName,
			constraints: [],
			options: validationOptions,
			
			validator: {
				validate(value: any, args: ValidationArguments) {
					let valid = !value.split('@')[1].includes('yahoo.com');
					valid = valid && (value.includes('rever') || value.includes('score'))
					return valid
				}
			}
		});
	};
}
