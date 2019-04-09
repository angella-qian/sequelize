const frisby = require('frisby');

const { Joi } = frisby;
// Destructuring syntax of this
// const Joi = frisby.Joi;

it('should return a status of 200 when the track is found', () => {
	return frisby
	.get('http://localhost:8000/api/tracks/5')
	.expect('status', 200);
});

it('should return a status of 404 when the track does not exist', () => {
	return frisby
	.get('http://localhost:8000/api/tracks/-1')
	.expect('status', 404);
});

/*it('should return the track name and its playlists', () => {
	return frisby
	.get('http://localhost:8000/api/tracks/5')
	.expect('json', 'name', 'Princess of the Dawn')
	.expect('jsonTypes', 'playlists.*', {
		id: Joi.number().required(),
		name: Joi.string().required()
	});
});*/

it('should return a status of 404 when the track does not exist', () => {
	return frisby
	.patch('http://localhost:8000/api/tracks-1')
	.expect('status', 404);
});

it('should return a status of 200 when the track is updated successfully', () => {
	return frisby
	.patch('http://localhost:8000/api/tracks/5', {
		name: 'Hello World',
		milliseconds: '100',
		unitPrice: '1'
	})
	.expect('status', 200);
});

it('should return a status of 422 when the track fails to update', () => {
	return frisby
	.patch('http://localhost:8000/api/tracks/5', {
		name: '',
		milliseconds: 'a',
		unitPrice: 'b'
	})
	.expect('status', 404)
	.expect('json', 'errors[0].message', 'Track name is required')
	.expect('json', 'errors[1].message', 'Milliseconds must be numeric')
	.expect('json', 'errors[2].message', 'Unit Price must be numeric');
});