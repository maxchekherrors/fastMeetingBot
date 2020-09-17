"use strict";
const config = require('./config');
const Koa = require('koa');
const helmet = require('koa-helmet')();
const compress = require('koa-compress')();
const cors = require('@koa/cors')({ allowMethods: ['POST'] });
const koaBody = require('koa-body')();
const bot = require('./bot');
const app = new Koa();
app.use(helmet)
    .use(compress)
    .use(cors)
    .use(koaBody);
app.use(async (ctx) => {
    if (ctx.method !== 'POST' || ctx.url !== `/${config.bot.password}`) {
        return;
    }
    await bot.handleUpdate(ctx.request.body, ctx.response);
    ctx.status = 200;
});
module.exports = app;