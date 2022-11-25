const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");


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
    someOtherFancyField: {
        type: String,
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

userSchema.methods.toJSON = function () {
    const user = this
    const result = user.toObject()
    delete result.password
    return result
}

userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
})

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

const User = mongoose.model("User", userSchema);

module.exports = User;
