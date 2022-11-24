const mongoose = require("mongoose");

const schema = new mongoose.Schema({
        text: {
            type: String,
            required: true,
            trim: true
        }, user: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true,
            trim: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        image: {
            type: Buffer
        },
        likes: {
            type: Array,
            default: [],
        }
    }, {
        timestamps: true
    }
)
const Tweet = mongoose.model("Tweet", schema);

module.exports = Tweet;
