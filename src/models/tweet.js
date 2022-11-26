const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema({
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


tweetSchema.methods.toJSON = function () {
    const tweet = this
    const result = tweet.toObject()
    delete result.user
    delete result.tokens
    return result
}

const Tweet = mongoose.model("Tweet", tweetSchema);
module.exports = Tweet;
