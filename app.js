const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

const Playlist = require('./models/playlist');
const Artist = require('./models/artist');
const Album = require('./models/album');
const Track = require('./models/track');

const { Op } = Sequelize;
const app = express();

app.use(bodyParser.json());

Artist.hasMany(Album, {
	foreignKey: 'ArtistId'
});

Album.belongsTo(Artist, {
	foreignKey: 'ArtistId'
});

Playlist.belongsToMany(Track, {
	through: 'playlist_track',
	foreignKey: 'PlaylistId',
	timestamps: false
});

Track.belongsToMany(Playlist, {
	through: 'playlist_track',
	foreignKey: 'TrackId',
	timestamps: false
})

/*const sequelize = new Sequelize('sqlite:chinook.db');

const Playlist = sequelize.define('playlist', {
	id: {
		field: 'PlaylistId',
		type: Sequelize.INTEGER,
		primaryKey: true
	},
	name: {
		field: 'Name',
		type: Sequelize.STRING
	}
}, {
	timestamps: false
});*/

app.patch('/api/tracks/:id', function (request, response) {
	let { id } = request.params;
	let updates = request.body;

	Track.findByPk(id, {
		include: [Playlist]
		}).then((track) => {
			console.log(track);
			if (track) {
				return track.update(updates);
			} else {
				return Promise.reject();
			}
		}).then((updatedTrack) => {
			// If the update passes validation, respond with a 200 status code and 
			// the updated track in the response body
			response.json(updatedTrack);
			response.status(200).send();
		}, (validation) => {
			// If the track isn’t found, return an empty response with a 404 status code.
			response.status(404).json({
				errors: validation.errors.map((error) => {
					return {
						attribute: error.path,
						message: error.message
					};
				})
			});
		});
});

app.delete('/api/playlists/:id', function(request, response) {
	let { id } = request.params;

	Playlist
		.findByPk(id)
		.then( (playlist) => {
			if (playlist) {
				return playlist.setTracks([]).then( () => {
					return playlist.destroy();
				});
			} else {
				return Promise.reject();
				
			}
		}).then( () => {
			response.status(204).send();
		}, () => {
			response.status(404).send();
		});
});

app.post('/api/artists', function(request, response) {
	Artist.create({
		name: request.body.name
	}).then( (artist) => {
		response.json(artist);
	}, (validation) => {
		response.status(422).json({
			errors: validation.errors.map((error) => {
				return {
					attribute: error.path,
					message: error.message
				};
			})
		});
	});
});

app.get('/api/playlists', function(request, response) {
	let filter = {};
	// let q = request.query.q;
	let { q } = request.query;

	if (q) {
		filter = {
			where: {
				name: {
					// Bracket to pass in a symbol, allows you to create
					// a unique key
					[Op.like]: `${q}%`
				}
			}
		};
	}


	Playlist.findAll().then( (playlists) => {
		response.json(playlists);
	}) 
});

app.get('/api/playlists/:id', function(request, response) {
	// let id = request.params.id;
	let { id } = request.params;

	Playlist.findByPk(id, {
		include: [Track]
	}).then( (playlist) => {
		if (playlist) {
			response.json(playlist);
		} else {
			response.status(404).send();
		}
		
	}); 
});

app.get('/api/tracks/:id', function(request, response) {
	// let id = request.params.id;
	let { id } = request.params;

	Track.findByPk(id, {
		include: [Playlist]
	}).then( (track) => {
		if (track) {
			response.json(track);
		} else {
			response.status(404).send();
		}
		
	}); 
});

app.get('/api/artists/:id', function(request, response) {
	// let id = request.params.id;
	let { id } = request.params;

	Artist.findByPk(id, {
		include: [Album]
	}).then( (artist) => {
		if (artist) {
			response.json(artist);
		} else {
			response.status(404).send();
		}
	}); 
});

app.get('/api/albums/:id', function(request, response) {
	// let id = request.params.id;
	let { id } = request.params;

	Album.findByPk(id, {
		include: [Artist]
	}).then( (album) => {
		if (album) {
			response.json(album);
		} else {
			response.status(404).send();
		}
		
	}); 
});

app.listen(process.env.PORT || 8000);