const express = require("express")
const Tweet = require("../models/tweet")
const auth = require("../middleware/auth");

const router = express.Router()

router.post('/tweet', auth, async (req, res) => {
    const tweet = new Tweet({
        ...req.body,
        user: req.body.user,
        userId: req.body.user.id,
        username: req.body.user.username
    })
    try {
        await tweet.save()
        res.status(200).json({
            statusCode: 200,
            status: 'success',
            data: {
                tweet: tweet.toJSON()
            },
            message: "Tweet created successfully"
        })
    } catch (err) {
        res.status(500).json({
            statusCode: 500,
            status: 'error',
            data: null,
            message: err.message
        })
    }
})

module.exports = router