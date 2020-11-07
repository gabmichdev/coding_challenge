import { use, expect } from 'chai';
import { CodeGeneratorService } from './code-generator.service';
import { PhoneNumberParserService } from './phone-number-parser.service';
import { TwilioService, messages, TwilioConfig } from './twilio.service';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';
import config from 'config';
import twilio from 'twilio';

use(sinonChai);

let twilioService: TwilioService;
let codeGeneratorService: CodeGeneratorService;
let mockPhoneNumber: string;
let phoneNumberParserService: PhoneNumberParserService;
let to: string;
let email: string;
// let sendNewVerificationMessageStub
let sendMessageStub: any;
let wrongCredentials: TwilioConfig = {
	accountSid: 'sC9f21843f2827a3ec624f4df552a2d70a',
	token: '3200d398e8601b1d8d4dbec809355cbb'
};
let correctCredentials: TwilioConfig = {
	accountSid: 'AC9f21843f2827a3ec624f4df552a2d70a',
	token: '3200d398e8601b1d8d4dbec809355cbb'
};

describe('Twilio Service', () => {
	beforeEach(() => {
		mockPhoneNumber = '+19729458287"';
		codeGeneratorService = new CodeGeneratorService();
		phoneNumberParserService = new PhoneNumberParserService();
		twilioService = new TwilioService(mockPhoneNumber, codeGeneratorService, phoneNumberParserService);
		twilioService.setCredentials(wrongCredentials);
		to = '3339734581';
		email = 'foo@rever.com';
	});
	it('Should try to send a verification message and fall back to the console when it fails', async () => {
		let sendMessageSpy = sinon.spy(twilioService, 'sendMessage');
		await twilioService.sendNewVerificationMessage(to, email);
		expect(sendMessageSpy).to.have.been.calledOnce;
	});
	it('Should prepare phone number before generating code', async () => {
		let phoneNumberParserServiceSpy = sinon.spy(twilioService.phoneNumberParserService, 'parsePhoneNumber');
		await twilioService.sendNewVerificationMessage(to, email);
		expect(phoneNumberParserServiceSpy).to.have.been.calledWith(to);
		expect(phoneNumberParserServiceSpy).returned('+523339734581');
	});
	// Comment this out if credentials are correct
	it('Should have generated a code', async () => {
		let codeGeneratorSpy = sinon.spy(twilioService.codeGeneratorService, 'generateCode');
		await twilioService.sendNewVerificationMessage(to, email);
		expect(codeGeneratorSpy).to.have.been.calledWith(
			email,
			twilioService.phoneNumberParserService.parsePhoneNumber(to)
		);
	});
	it('Should call the Twilio client when sending message and fail if loads wrong configuration', async () => {
		let clientSpy = sinon.spy(twilioService, 'getClient');
		await twilioService.sendNewVerificationMessage(to, email);
		expect(clientSpy).to.have.been.calledOnce;
		const client = await twilioService.getClient();
		expect(client).to.be.null;
	});
	it('Should raise an error if phone number is wrong and to be called twice', async () => {
		twilioService.setCredentials(correctCredentials);
		const sendMessageStubReject = sinon.stub(twilioService, 'sendMessage').rejects('Invalid phone number!');
		twilioService.sendMessage('NOT A PHONE NUMBER', 'This will fail', {}, 'SMS').catch((err) => {
			expect(sendMessageStubReject).to.be.called;
			expect(err).to.be.equal('Invalid phone number!')
		})
		
	});
	it('Should send SMS if client loads correctly', async () => {
		twilioService.setCredentials(correctCredentials);
		const sendMessageStub = sinon
			.stub(twilioService, 'sendMessage')
			.resolves(
				console.log('No test Twilio accounts were harmed during this test. Sent through the SMS subsystem.')
			);
		await twilioService.sendMessage('+523339734581', 'This will not fail {yeih}', { yeih: 'Yeih!' }, 'SMS');
		expect(sendMessageStub).to.be.called;
	});
});
