const sequelize = require('./../database/sequelize');
const Sequelize = require('sequelize');

module.exports = sequelize.define('artist', {
	id: {
		field: 'ArtistId',
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	name: {
		field: 'Name',
		type: Sequelize.STRING,
		validate: {
			notEmpty: {
				args: true,
				msg: 'Artist name is required'
			},
			isAlpha: {
				args: true,
				msg: 'Artist name must only contain letters'
			},
			len: {
				args: [2, 10],
				msg: 'Artist name must be between 2 and 10 characters'
			}
		}
	}
}, {
	timestamps: false
});