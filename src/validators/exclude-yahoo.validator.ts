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
				validate(email: any, args: ValidationArguments) {
					return notValidEmail(email);
				}
			}
		});
	};
}

export const notValidEmail = (email: string) => {
	let valid = !email.split('@')[1].includes('yahoo.com');
	return valid && (email.includes('rever') || email.includes('score'));
};
