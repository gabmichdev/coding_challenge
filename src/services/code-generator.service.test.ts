import { expect } from 'chai';
import { response } from 'express';
import { GenericError } from '../interfaces/responses';
import { CodeGeneratorService, ICodeInfoQuery, ICodeInfo } from './code-generator.service';

let codeGeneratorService: CodeGeneratorService;
let mockEmail: string;
let mockPhoneNumber: string;
let mockQuery: ICodeInfoQuery;

describe('Code Generator Service', () => {
	beforeEach(() => {
		codeGeneratorService = new CodeGeneratorService();
		mockQuery = { code: '1234', email: 'rever@gmail.com', phoneNumber: '123' };
	});
	it('Should instantiate a code generator service', () => {
		expect(codeGeneratorService).to.be.instanceOf(CodeGeneratorService);
	});
	it('Should generate a 4 digit', () => {
		mockEmail = 'foo@rever.com';
		mockPhoneNumber = '33344455529';
		expect(codeGeneratorService.generateCode(mockEmail, mockPhoneNumber)).to.have.lengthOf(4);
	});
	it('Should generate a 6 digit', () => {
		mockEmail = 'foo@score.com';
		mockPhoneNumber = '33344455529';
		expect(codeGeneratorService.generateCode(mockEmail, mockPhoneNumber)).to.have.lengthOf(6);
	});
	it('Should generate a 8 digit', () => {
		mockEmail = 'foo@rever.score.com';
		mockPhoneNumber = '33344455529';
		expect(codeGeneratorService.generateCode(mockEmail, mockPhoneNumber)).to.have.lengthOf(8);
	});
	it('Should throw an error if the length of the code is less than 1', () => {
		expect(() => codeGeneratorService.getCode(0)).to.throw('An error ocurred when generating code');
	});
	it('Should return undefined if query does not match any code info', () => {
		const result = codeGeneratorService.getCodeInfo(mockQuery.code, mockQuery.email, mockQuery.phoneNumber);
		expect(result).to.be.undefined;
	});
	it('Should save code info', () => {
		let mockCodeInfo: ICodeInfo = {
			email: mockQuery.email as string,
			phoneNumber: mockQuery.phoneNumber as string,
			code: mockQuery.code as string,
			verified: false
		};
		const result = codeGeneratorService.saveCodeInfo(mockCodeInfo);
		expect(result.code).to.be.equal(mockCodeInfo.code);
		expect(result.email).to.be.equal(mockCodeInfo.email);
		expect(result.phoneNumber).to.be.equal(mockCodeInfo.phoneNumber);
        expect(result.verified).to.be.equal(mockCodeInfo.verified);
        expect(codeGeneratorService.codesGenerated[0]).to.exist.and.to.deep.equal(result)
	});

	it('Should return a code info if query matches one of the existing code infos with the provided data', () => {
		let mockCodeInfo: ICodeInfo = {
			email: mockQuery.email as string,
			phoneNumber: mockQuery.phoneNumber as string,
			code: mockQuery.code as string,
			verified: false
		};
        const result = codeGeneratorService.saveCodeInfo(mockCodeInfo);
        const codeInfoFound = codeGeneratorService.getCodeInfo(undefined, undefined, mockCodeInfo.phoneNumber)
        expect(codeInfoFound).to.exist
        expect(codeInfoFound).to.deep.equal(mockCodeInfo)
	});
});
