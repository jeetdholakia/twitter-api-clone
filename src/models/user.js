const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error('Password cannot contain "password"');
            }
        },
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
    avatar: {
        type: Buffer,
    },
    avatarExists: {
        type: Boolean,
    },
    bio: {
        type: String,
    },
    website: {
        type: String,
    },
    location: {
        type: String,
    },
    followers: {
        type: Array,
        default: [],
    },
    followings: {
        type: Array,
        default: [],
    },
});

userSchema.virtual('tweets', {
    ref: 'Tweet',
    localField: '_id',
    foreignField: 'user'
})

userSchema.virtual('notificationsSent', {
    ref: 'Notification',
    localField: '_id',
    foreignField: 'notificationSenderId'
})

userSchema.virtual('notificationsReceived', {
    ref: 'Notification',
    localField: '_id',
    foreignField: 'notificationReceiverId'
})

userSchema.methods.toJSON = function () {
    const user = this
    const result = user.toObject()
    delete result.password
    delete result.tokens
    return result
}

userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    // Set a global variable here
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async function (email, password) {
    const user = await this.findOne({
        email: email
    });
    if (!user) {
        throw new Error("Couldn't find user'")
    }
    const userFound = await bcrypt.compare(password, user.password)
    if (!userFound) {
        throw new Error("Password doesn't match")
    }
    return user
}

const user = mongoose.model("User", userSchema);

module.exports = user;
