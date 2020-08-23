module.exports = ({session,replyWithHTML}, next)=>{
	const interval = process.env.TOUCH_INTERVAL||60;
	const maxTouches = process.env.MAX_TOUCHES||60;
	if(!session.touch)
		session.touch = {last:Date.now(),count:0};
	const {touch} = session;
	if(Date.now() - touch.last>interval*1000){
		touch.last = Date.now();
		touch.count = 0;
	}
	let dif;
	if(( dif = ++touch.count-maxTouches ) > 0){
		touch.last = Date.now();
		return dif>1?void 0:replyWithHTML(`<b>Охлади свое трахание, углепластик!\nУлетаеш в бан на ${interval} секунд.</b>`);
	}
	return next();
};