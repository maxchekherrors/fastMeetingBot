const Extra = require('telegraf/extra');
const conf = require('../locals/ru').middleware.spam;
const interval = process.env.TOUCH_INTERVAL||60;
const maxTouches = process.env.MAX_TOUCHES||60;
module.exports = ({session,replyWithAudio}, next)=>{
	if(!session.__touch)
		session.__touch = {last:Date.now(),count:0};
	const {__touch} = session;
	if(Date.now() - __touch.last>interval*1000){
		__touch.last = Date.now();
		__touch.count = 0;
	}
	let dif;
	if(( dif = ++__touch.count-maxTouches ) > 0){
		__touch.last = Date.now();
		return dif>1?void 0:replyWithAudio(`${conf.files.banAudio}`,Extra
			.HTML()
			.load({caption:`${conf.text.ban}`}));
	}
	return next();
};