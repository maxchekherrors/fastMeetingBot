'use strict';
const joi = require('joi');
const envSchema = joi
    .object({
        DATABASE_CONNECTION: joi.string().required()
    })
    .unknown()
    .required();

const {error, value: envVars} = envSchema.validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}
const config = {
    database: {
        connectionString: envVars.DATABASE_CONNECTION
    }
};

module.exports = config;