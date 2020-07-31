const{askLocation,gteLocation,getInviteDescription,getInvitePhoto,findFriends,dropInvite,submit,createInvite,getContact} =  require('../controlers/invite');
const Scene = require('telegraf/scenes/base');

const inviteLocation = new Scene('inviteLocation');
const inviteDescription = new Scene('inviteDescription');
const inviteAvailable = new Scene('inviteAvailable');

inviteDescription.hears('Submit',submit);
inviteDescription.enter(createInvite);
inviteDescription.on('text',getInviteDescription);
inviteDescription.on('photo', getInvitePhoto);
inviteDescription.on('contact', getContact)


inviteAvailable.hears('Drop Invite', dropInvite);
inviteAvailable.enter(findFriends);

inviteLocation.enter(askLocation);
inviteLocation.on('location',gteLocation);



exports.inviteLocation = inviteLocation;
exports.inviteDescription = inviteDescription;
exports.inviteAvailable = inviteAvailable;