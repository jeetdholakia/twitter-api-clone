const express = require("express")
const auth = require("../middleware/auth");
const Notification = require("../models/notification")

const router = express.Router();

router.get('/notifications', auth, async (req, res) => {
    try {
        const notifications = await Notification.find({})
        res.status(200).json({
            statusCode: 200,
            success: true,
            data: notifications,
            message: "Successfully fetched notifications"
        })
    } catch (err) {
        res.status(500).json({
            statusCode: 500,
            success: false,
            data: null,
            message: err.message,
        })
    }
})

router.get('/notifications/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const notifications = await Notification.find({notReceiverId: _id})
        res.status(200).json({
            statusCode: 200,
            success: true,
            data: notifications,
            message: "Successfully fetched notifications"
        })
    } catch (err) {
        res.status(500).json({
            statusCode: 500,
            success: false,
            data: null,
            message: err.message,
        })
    }
})

router.post('/notifications', auth, async (req, res) => {
    const notification = new Notification({
        ...req.body,
        user: req.user._id
    })
    try {
        await notification.save()
        res.status(201).json({
            statusCode: 201,
            success: true,
            data: notification,
            message: "Successfully created notification"
        })
    } catch (err) {
        res.status(500).json({
            statusCode: 500,
            success: false,
            data: null,
            message: err.message
        })
    }
})

module.exports = router