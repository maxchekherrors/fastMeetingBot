'use strict';
const joi = require('joi');
const envSchema = joi
    .object({
        AI_API_KEY: joi
            .string()
            .required(),
        WEB_HOOK: joi.string().required(),
        UPLOAD_PASSWORD: joi.string()
    })
    .unknown()
    .required();
const {error, value: envVars} = envSchema.validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}
const config = {
    apiAI: {
        apiKey: envVars.AI_API_KEY,
        source: `${envVars.WEB_HOOK}/${envVars.UPLOAD_PASSWORD}`
    }
};
module.exports = config;