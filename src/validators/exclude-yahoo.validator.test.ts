import { use, expect } from 'chai';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';
import twilio from 'twilio';
import { notValidEmail } from './exclude-yahoo.validator';

describe('Exclude Non Rever Email Addresses', () => {
	beforeEach(() => {});
	it('Should reject any email address not containing rever or/and score', () => {
		const emails = 'foo@bar.com,john@doe.com,gabriel.michel@gmail.com'.split(',');
		emails.forEach((email: string) => {
			expect(notValidEmail(email)).to.be.false;
		});
	});
	it('Accept email addresses that contain rever or/and score', () => {
		const emails = 'foo@rever.com,john@score.com,gabriel.michel@rever.score.com'.split(',');
		emails.forEach((email: string) => {
			expect(notValidEmail(email)).to.be.true;
		});
	});
});
