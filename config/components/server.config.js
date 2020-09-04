'use strict';
const joi = require('joi');
const envSchema = joi
	.object({
		NODE_ENV: joi.string().allow('development', 'production', 'test'),
		PORT: joi.number(),
		API_VERSION: joi.number(),
	})
	.unknown()
	.required();

const {error, value: envVars} = envSchema.validate(process.env);
if (error) {
	throw new Error(`Config validation error: ${error.message}`);
}
const config = {
	env: envVars.NODE_ENV,
	isTest: envVars.NODE_ENV === 'test',
	isDevelopment: envVars.NODE_ENV === 'development',
	server: {
		port: envVars.PORT || 3000,
		apiVersion: envVars.API_VERSION || 'v1',
	},
};
module.exports = config;