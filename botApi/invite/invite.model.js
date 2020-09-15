'use strict';
const mongoose = require('mongoose');
const User = require('../user/user.model');
const {searchRadius} = require('../../config').bot;
const inviteSchema = new mongoose.Schema({
	userId: {
		type: Number,
		required: true,
	},
	description: {
		type: String,
		default: 'I just want sex with you ;)',
	},
	location: {
		lat: {
			type: Number,
			default: 0,
		},
		lon: {
			type: Number,
			default: 0,
		},
	},
	ready: {
		type: Boolean,
		default: false,
	},
	startDate: {
		type: Date,
		default: Date.now(),
	},
	endDate: {
		type: Date,
		default: Date.now() + 1000 * 60 * 30,
	},
	photo: {
		type: String,
		default: '',
	},
	agreedInvitations: [mongoose.Schema.ObjectId],

});
inviteSchema.virtual('available').get(function () {
	return this.ready && (Date.now() < this.endDate);
});

inviteSchema.methods.getUserInfo = async function () {
	return User.findOne({_id: this.userId},'phoneNumber firstName age description sex photo');
};

inviteSchema.methods.findAround = function (limit = 10) {
	const minLat = this.location.lat - (searchRadius / 111.0);
	const maxLat = this.location.lat + (searchRadius / 111.0);
	const minLong = this.location.lon - searchRadius / Math.abs(Math.cos(Math.PI / 180 * this.location.lat) * 111.0);
	const maxLong = this.location.lon + searchRadius / Math.abs(Math.cos(Math.PI / 180 * this.location.lat) * 111.0);
	return mongoose
		.model('invite').find({
			$and: [
				{_id: {$ne: this._id}},
				{ready: true},
				{endDate: {$gte: Date.now()}},
				{'location.lat': {$gte: minLat}},
				{'location.lat': {$lte: maxLat}},
				{'location.lon': {$gte: minLong}},
				{'location.lon': {$lte: maxLong}},
			],
		})
		.sort({startDate:-1})
		.limit(limit);
};
const Invite = mongoose.model('invite', inviteSchema);
module.exports = Invite;
