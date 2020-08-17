const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	_id: Number,
	phoneNumber: {
		type: String,
		default: '',
	},
	sex: {
		type: String,
		default: 'm',
		enum: ['m', 'f']
	},
	age: Number,
	userName: {
		type: String,
		default: '',
	},
	firstName: {
		type: String,
		default: '',
	},
	lastName: {
		type: String,
		default: '',
	},
	description: {
		type: String,
	},
	photo: {
		type: String,
		default: '',
	},
	lastInvite: mongoose.Schema.ObjectId,
	updatedAt: {
		type: Date,
		default: Date.now(),
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});
userSchema.virtual('fullName').get(function () {
	return `${this.firstName} ${this.lastName}`;
});
userSchema.pre('save', function (next) {
	this.updatedAt = Date.now();
	return next();
});
const User = mongoose.model('users', userSchema);
module.exports = User;
