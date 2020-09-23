'use strict';
const config = require('./config');
const Koa = require('koa');
const helmet = require('koa-helmet')();
const compress = require('koa-compress')();
const cors = require('@koa/cors')({ allowMethods: ['POST','GET'] });
const koaBody = require('koa-body')();
const Router = require('koa-router');
const fetch = require('node-fetch');
const bot = require('./bot');

const app = new Koa();
const router = new Router();

router.post(`/${config.bot.password}`,async ctx=>{
	await bot.handleUpdate(ctx.request.body, ctx.response);
	ctx.status = 200;
});
router.get(`/uploads/:id`,async ctx=>{
	const fileLink = await bot.telegram.getFileLink(ctx.params.id);
	if(!fileLink) return ctx.status = 404;
	return  fetch(`${fileLink}`).then(res=>{
		ctx.body  = res.body;
	});
});


app.use(helmet)
	.use(compress)
	.use(cors)
	.use(koaBody)
	.use(router.routes());

module.exports = app;