const express = require("express")
const Tweet = require("../models/tweet")
const auth = require("../middleware/auth")
const sharp = require("sharp")
const multerUploader = require("../middleware/multer")

const router = express.Router()

router.get("/tweet", auth, async (req, res) => {
    try {
        const tweets = await Tweet.find()
        res.status(200).json({
            statusCode: 200,
            status: "success",
            data: tweets,
            message: "Tweets fetched successfully"
        })
    } catch (err) {
        res.status(500).json({
            statusCode: 500,
            status: "error",
            data: err,
            message: err.message
        })
    }
})

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

router.post('/tweetImage/:id', auth, multerUploader.single('upload'), async (req, res) => {
    const tweet = await Tweet.findOne({ _id: req.params.id })
    if (!tweet) {
        res.status(404).json({
            statusCode: 404,
            status: "Error",
            data: null,
            message: "Tweet not found"
        })
    }
    console.log(req)
    tweet.image = await sharp(req.file.buffer).resize({width: 350, height: 350}).jpeg().toBuffer()
    await tweet.save()
    res.status(201).json({
        statusCode: 201,
        status: "Success",
        data: null,
        message: "Picture saved successfully",
    })
}, (error, req, res, next) => {
    res.status(400).json({
        statusCode: 400,
        status: "Error",
        data: null,
        message: error.message
    })
})

module.exports = router