
module.exports = (ctx,next) => {
	if(!ctx.message)return next();
	const {text} = ctx.message;
	ctx.getNumber = (from = 0,to = Infinity) => {
		if (!text) return void 0;
		const number = Number(text);
		if (!number || number < from || number > to) return void 0;
		return number;
	};
	ctx.getMessage = (minLen = 1,maxLen = Infinity,linesCount = Infinity) => {
		if (!text) return void 0;
		const {length} = text;
		const nextl = text.match(/\n/g);
		const lines = nextl ? nextl.length : 0;
		if (length > maxLen || length < minLen || lines > linesCount) return void 0;
		return text;
	};
	return next();
};