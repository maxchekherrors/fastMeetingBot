const Extra = require('telegraf/extra');
const conf = require('../../locals/ru').profile;
const User = require('./user.model');

exports.profileSex = {
    ask: ctx => {
        return ctx.replyWithHTML(`${conf.sex.text.enter}`, Extra.markup(m => m
            .resize()
            .keyboard([
                    [conf.sex.buttons.female, conf.sex.buttons.male]
                ]
            )
        ));
    },
    get: async ctx => {
        const {userId} = ctx;
        const sex = ctx.message.text;
        let userSex = 'm';
        let answ = '';
        switch (sex) {
            case conf.sex.buttons.male:
                answ = conf.sex.text.successM;
                userSex = 'm';
                break;
            case conf.sex.buttons.female:
                answ = conf.sex.text.successF;
                userSex = 'f';
                break;
            default:
                return ctx.replyWithHTML(`${conf.sex.text.error}`);
        }
        await User.updateOne({_id: userId}, {
            $set: {sex: userSex}
        });
        ctx.sceneComplete();
        return ctx.replyWithHTML(`${answ}`, Extra.markup(m => m
                .resize()
                .keyboard([
                    `${conf.sex.buttons.submit}`
                ])
            )
        );

    },
    error: ctx => ctx
        .replyWithHTML(`${conf.sex.text.error}`)
};
exports.profilePhoto = {
    ask: ctx => ctx
        .replyWithHTML(`${conf.photo.text.enter}`,
            Extra.markup(m => m.removeKeyboard())
        )
    ,
    get: async (ctx) => {
        const {userId} = ctx;
        const photo = ctx.message.photo[0].file_id;
        await User.updateOne({_id: userId}, {
            $set: {photo},
        });
        ctx.sceneComplete();
        return ctx.replyWithHTML(`${conf.photo.text.success}`, Extra.markup(m => m
            .resize()
            .keyboard([
                `${conf.photo.buttons.submit}`
            ])));

    },
    error: ctx => ctx
        .replyWithHTML(`${conf.sex.text.error}`, Extra.markup(m => m.removeKeyboard()))
};
exports.profileAge = {
    ask: ctx => ctx
        .replyWithHTML(`${conf.age.text.enter}`, Extra.markup(m => m.removeKeyboard())),
    get: async (ctx) => {
        const {userId} = ctx;
        const age = Number(ctx.message.text);
        if (!age || age < 5 || age > 90) {
            return ctx.replyWithHTML(`${conf.age.text.notInRange}`);
        }
        await User.updateOne({_id: userId}, {age});
        ctx.sceneComplete();
        return ctx.replyWithHTML(`${conf.age.text.success}`, Extra.markup(m => m
            .resize()
            .keyboard([
                `${conf.age.buttons.submit}`
            ])));

    },

    error: ctx => ctx
        .replyWithHTML(`${conf.age.text.error}`)
};
exports.profileContact = {
    ask: async (ctx) => {
        ctx.sceneComplete();
        return ctx.replyWithHTML(`${conf.contact.text.enter}`,
            Extra.markup((markup) => markup.resize()
                .keyboard([
                    [markup.contactRequestButton(`${conf.contact.buttons.send}`)],
                    [`${conf.contact.buttons.refuse}`],
                ]).oneTime()));
    },
    get: async (ctx) => {
        const {userId} = ctx;
        const phone = ctx.message.contact.phone_number;
        await User.updateOne({_id: userId}, {$set: {phoneNumber: phone}});
        return ctx.nextScene();
    },
    error: ctx => ctx
        .replyWithHTML(`${conf.contact.text.error}`)
};
exports.profileDescription = {
    ask: ctx => ctx
        .replyWithHTML(`${conf.description.text.enter}`,
            Extra.markup(m => m.removeKeyboard())
        ),
    get: async (ctx) => {
        const {userId} = ctx;
        let answ = conf.description.text.success;
        let desc = ctx.message.text;
        if (desc.length > 300) {
            desc = desc.slice(0, 300);
            desc += '...';
            answ = conf.description.text.toLarge;
        }
        await User.updateOne({_id: userId}, {description: desc});
        ctx.sceneComplete();
        return ctx.replyWithHTML(`${answ}`, Extra.markup(m => m
            .resize()
            .keyboard([
                `${conf.description.buttons.submit}`
            ])));
    },
    error: ctx => ctx
        .replyWithHTML(`${conf.description.text.error}`)
};
exports.profileUpdate = {
    do: async (ctx) => {
        const {from} = ctx.message;
        let answ = '';
        const user = {
            _id: from.id,
            firstName: from.first_name,
            lastName: from.last_name,
            userName: from.username,
        };
        if (!await User.exists({_id: from.id})) {
            await new User(user).save();
            answ = conf.create.text.enter
        } else {
            await User.updateOne({_id: from.id}, {user});
            answ = conf.create.text.reenter;
        }
        ctx.sceneComplete();
        return await ctx.replyWithHTML(`${answ}`, Extra.markup(m => m
            .resize()
            .keyboard([
                `${conf.create.buttons.submit}`
            ])
        ));
    }
};
exports.next = ctx=>ctx.nextScene();




