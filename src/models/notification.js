const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    notificationSenderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    notificationReceiverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    notificationType: {
        type: String
    },
    notificationText: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const notification = mongoose.model("Notification", notificationSchema)
module.exports = notification