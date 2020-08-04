const{askLocation,gteLocation,getInviteDescription,getInvitePhoto,findFriends,dropInvite,submit,createInvite} =  require('../controlers/invite');
const Scene = require('telegraf/scenes/base');

const inviteLocation = new Scene('inviteLocation');
const inviteDescription = new Scene('inviteDescription');
const inviteAvailable = new Scene('inviteAvailable');

inviteDescription.hears('Submit',submit);
inviteDescription.enter(createInvite);
inviteDescription.on('text',getInviteDescription);
inviteDescription.on('photo', getInvitePhoto);
inviteDescription.on('message', ctx=>ctx.reply('Description can consists of text and photo'));
//inviteDescription.on('contact', getContact)

inviteLocation.enter(askLocation);
inviteLocation.on('location',gteLocation);
inviteDescription.on('message', ctx=>ctx.reply('Send me your location, fagot!'));

inviteAvailable.hears('Drop Invite', dropInvite);
inviteAvailable.enter(findFriends);
inviteAvailable.action('ignore',ctx=>ctx.deleteMessage());
inviteAvailable.on('callback_query',ctx=>{


});
inviteAvailable.on('message', ctx=>ctx.reply('Yuo can drop invite, if you want go back to menu'));


exports.inviteLocation = inviteLocation;
exports.inviteDescription = inviteDescription;
exports.inviteAvailable = inviteAvailable;