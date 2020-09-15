'use strict';
const Extra = require('telegraf/extra');
const lcl = require('../locals/ru').middleware.spam;
const {maxTouches,touchInterval} = require('../config').bot;
module.exports = ({session,replyWithAudio}, next)=>{
	if(!session.__touch)
		session.__touch = {last:Date.now(),count:0};
	const {__touch} = session;
	if(Date.now() - __touch.last>touchInterval){
		__touch.last = Date.now();
		__touch.count = 0;
	}
	let dif;
	if(( dif = ++__touch.count-maxTouches ) > 0){
		__touch.last = Date.now();
		return dif>1?void 0:replyWithAudio(`${lcl.files.banAudio}`,Extra
			.HTML()
			.load({caption:`${lcl.text.ban}`}));
	}
	return next();
};