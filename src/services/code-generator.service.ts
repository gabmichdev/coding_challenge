import { Matches } from 'class-validator';
import { Service } from 'typedi';
import { GenericError } from '../interfaces/responses';
import Container from 'typedi';

export interface ICodeInfo {
	code: string;
	email: string;
	phoneNumber: string;
	verified: boolean;
}

export interface ICodeInfoQuery {
	code?: string;
	email?: string;
	phoneNumber?: string;
}

@Service()
export class CodeGeneratorService {
	codesGenerated: ICodeInfo[] = [];
	generateCode(email: string, phoneNumber: string): string {
		let requiredCodeLength;
		if (email.includes('rever') && email.includes('score')) {
			requiredCodeLength = 8;
		} else if (email.includes('score')) {
			requiredCodeLength = 6;
		} else if (email.includes('rever')) {
			requiredCodeLength = 4;
		} else {
			throw new GenericError(400, 'Your email is not a Rever address');
		}
		const code = this.getCode(requiredCodeLength);
		const codeInfo: ICodeInfo = { code, email, phoneNumber, verified: false };
		const codeInfoSaved = this.saveCodeInfo(codeInfo);
		return codeInfoSaved.code;
	}

	getCode(length: number): string {
		if (length < 1) {
			throw new GenericError(400, 'An error ocurred when generating code');
		}
		let code = '';
		for (let i = 0; i < length; i++) {
			code += Math.floor(1 + Math.random() * 9).toString();
		}
		return code;
	}

	saveCodeInfo(codeInfo: ICodeInfo) {
		const codeInfoFound = this.getCodeInfo(undefined, codeInfo.email, codeInfo.phoneNumber);
		if (!codeInfoFound) {
			this.codesGenerated.push(codeInfo);
			return codeInfo;
		}
		codeInfoFound.code = codeInfo.code;
		return codeInfoFound;
	}

	getCodeInfo(code?: string, email?: string, phoneNumber?: string): ICodeInfo | undefined {
		const query: ICodeInfoQuery = {};
		if (code) {
			query.code = code;
		}
		if (email) {
			query.email = email;
		}
		if (phoneNumber) {
			query.phoneNumber = phoneNumber;
		}
		return this.codesGenerated.find((codeInfo: ICodeInfo) => {
			let found = true;
			if (query.email) {
				found = found && (query.email === codeInfo.email ? true : false);
			}
			if (query.code) {
				found = found && (query.code === codeInfo.code ? true : false);
			}
			if (query.phoneNumber) {
				found = found && (query.phoneNumber === codeInfo.phoneNumber ? true : false);
			}
			console.table({
				emailQuery: query.email,
				infoEmail: codeInfo.email,
				codeQuery: query.code,
				infoCode: codeInfo.code,
				phoneNumberQuery: query.phoneNumber,
				infoPhoneNumber: codeInfo.phoneNumber,
				found
			});
			console.log(`Found: ${found}`);
			return found;
		});
	}

	printCurrentCodes(): void {
		console.log(this.codesGenerated);
	}
}