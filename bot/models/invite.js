const mongoose = require('mongoose');
const inviteSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        default: "I just want sex with you ;)"
    },
    location: {
        lat: {
            type: Number,
            default:0
        },
        long: {
            type: Number,
            default:0
        }
    },
    ready: {
        type: Boolean,
        default: false
    }
    ,
    startDate: {
        type: Date,
        default: Date.now()
    },
    endDate: {
        type: Date,
        default: Date.now() + 1000 * 60 * 30
    },
    photo: {
        type: String,
        default: ''
    },
    agreedInvitations: [mongoose.Schema.ObjectId]

});
inviteSchema.virtual('available').get(function () {
    return this.ready && (Date.now() < this.endDate);
});
inviteSchema.methods.findAround = function (dist = 4) {
    return mongoose.model('invite').find({
        $and: [
            {'location.lat': {$gte: this.location.lat - (dist / 111.0)}},
            {'location.lat': {$lte: this.location.lat + (dist / 111.0)}},
            {'location.long': {$gte: this.location.long + dist / Math.abs(Math.cos(Math.PI / 180 * this.location.lat) * 111.0)}},
            {'location.long': {$lte: this.location.long - dist / Math.abs(Math.cos(Math.PI / 180 * this.location.lat) * 111.0)}}

        ]

    })
};
const Invite = mongoose.model("invite", inviteSchema);
module.exports = Invite;
