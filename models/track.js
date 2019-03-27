const sequelize = require('./../database/sequelize');
const Sequelize = require('sequelize');

module.exports = sequelize.define('track', {
	id: {
		field: 'TrackId',
		type: Sequelize.INTEGER,
		primaryKey: true
	},
	// If the update fails validation, return a JSON response where each object contains 
	// the attribute that failed validation and a user friendly error message.
	name: {
		field: 'Name',
		type: Sequelize.STRING,
		validate: {
			notEmpty: {
				args: true,
				msg: 'Track name is required'
			}
		}
	},
	milliseconds: {
		field: 'Milliseconds',
		type: Sequelize.INTEGER,
		validate: {
			isNumeric: {
				args: true,
				msg: 'Milliseconds must be numeric'
			}
		}
	},
	unitPrice: {
		field: 'UnitPrice',
		type: Sequelize.INTEGER,
		validate: {
			isNumeric: {
				args: true,
				msg: 'Unit Price must be numeric'
			}
		}
	}
}, {
	timestamps: false
});