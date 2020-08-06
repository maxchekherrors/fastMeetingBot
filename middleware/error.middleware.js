module.exports = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        console.log('Error handler:', err);
        ctx.reply('Something brake, my coder PROTUPYV');
    }
};
