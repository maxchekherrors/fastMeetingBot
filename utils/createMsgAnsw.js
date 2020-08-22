const Extra = require('telegraf/extra');
module.exports = (answer,removeKb) => ctx=>{
	const extra = Extra.HTML();
	if(removeKb)
		extra.markup(m=>m.removeKeyboard());
	ctx.reply(answer,extra);
};