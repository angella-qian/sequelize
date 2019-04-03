const { expect } = require('chai');
const Artist = require('./../../../models/artist');

describe('artist', () => {
	describe('name', () => {
	it('should be at least 2 characters', async () => {
		try {
			let artist = new Artist({ name: 'a' });
			await artist.validate();
		} catch (error) {
			expect(error.errors[0].message).to.equal('Artist name must be between 2 and 10 characters');
		}
	});

	it('should be at most 10 characters', async () => {
		try {
			let artist = new Artist({ name: 'abcdefghijk' });
			await artist.validate();
		} catch (error) {
			expect(error.errors[0].message).to.equal('Artist name must be between 2 and 10 characters');
		}
	});

	it('should contain only alphabetical letters', async () => {
		try {
			let artist = new Artist({ name: '1' });
			await artist.validate();
		} catch (error) {
			expect(error.errors[0].message).to.equal('Artist name must only contain letters');
		}
	});
});
})
