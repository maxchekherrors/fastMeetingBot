'use strict';
const joi = require('joi');
const envSchema = joi
	.object({
		WEB_HOOK: joi.string().required(),
		BOT_PASSWORD: joi.string().alphanum(),
		BOT_TOKEN: joi.string().required(),
		SEARCH_RADIUS: joi.number().integer().min(1).max(50),
		MAX_TOUCHES: joi.number().integer().min(5).max(60),
		TOUCH_INTERVAL: joi.number().integer().min(5).max(60),
		INVITE_INTERVAL:joi.number().integer().min(0).max(30),
		INVITE_LIMIT:joi.number().integer().min(1).max(30)
	})
	.unknown()
	.required();

const {error, value: envVars} = envSchema.validate(process.env);
if (error) {
	throw new Error(`Config validation error: ${error.message}`);
}
const config = {
	bot: {
		token: envVars.BOT_TOKEN,
		password: envVars.BOT_PASSWORD,
		webHook: `${envVars.WEB_HOOK}/${envVars.BOT_PASSWORD}`,
		searchRadius: envVars.SEARCH_RADIUS||2,
		maxTouches:envVars.MAX_TOUCHES||10,
		touchInterval:(envVars.TOUCH_INTERVAL||10)*1000,
		inviteInterval:(envVars.INVITE_INTERVAL||10)*60*1000,
		inviteLimit:envVars.INVITE_LIMIT||10
	}
};

module.exports = config;