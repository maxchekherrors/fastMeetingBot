'use strict';
const Scene = require('telegraf/scenes/base');
//const simpleAnswer = require('../../utils/createMsgAnsw');
const {profile:lcl} = require('../../locals/ru');
const controllers = require('./user.controller');
const {next} = controllers;


exports.profileUpdate = () => {
	const {profileUpdate} = controllers;
	const update = new Scene('profileUpdate');
	update.hears(`${lcl.create.buttons.submit}`,next);
	update.enter(profileUpdate.do);
	return update;
};

exports.profileAge = () => {
	const {profileAge} = controllers;
	const age = new Scene('profileAge');
	age.enter(profileAge.ask);
	age.hears(`${lcl.age.buttons.submit}`,next);
	age.on('text', profileAge.get);
	age.on('message', profileAge.error);
	return age;
};
exports.profileDescription = () => {
	const {profileDescription} = controllers;
	const description = new Scene('profileDescription');
	description.enter(profileDescription.ask);
	description.hears(`${lcl.description.buttons.submit}`,next);
	description.on('text', profileDescription.get);
	description.on('message', profileDescription.error);
	return description;
};
exports.profilePhoto = () => {
	const {profilePhoto} = controllers;
	const photo = new Scene('profilePhoto');
	photo.enter(profilePhoto.ask);
	photo.hears(`${lcl.photo.buttons.submit}`,next);
	photo.hears(`${lcl.photo.buttons.getProfilePhoto}`,profilePhoto.download);
	photo.on('photo', profilePhoto.get);
	photo.on('message', profilePhoto.error);
	return photo;
};


exports.profileContact = () => {
	const {profileContact} = controllers;
	const contact = new Scene('profileContact');
	contact.enter(profileContact.ask);
	contact.hears(`${lcl.contact.buttons.refuse}`, profileContact.skip);
	contact.on('contact', profileContact.get);
	contact.on('message', profileContact.error);
	return contact;
};



exports.profileSex = ()=>{
	const {profileSex} = controllers;
	const sex = new Scene('profileSex');
	sex.enter(profileSex.ask);
	sex.hears(`${lcl.sex.buttons.submit}`,next);
	sex.on('text',profileSex.get);
	sex.on('message',profileSex.error);
	return sex;
};
exports.profileEdit = ()=>{
	const {profileEdit} = controllers;
	const edit = new Scene('profileEdit');
	edit.enter(profileEdit.ask);
	edit.on('text',profileEdit.get);
	edit.on('message',profileEdit.error);
	return edit;
};

