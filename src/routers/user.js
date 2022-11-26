const express = require("express")
const User = require("../models/user")
const jwt = require("jsonwebtoken")
const auth = require("../middleware/auth")
const sharp = require("sharp")
const multerUploader = require("../middleware/multer")

const router = new express.Router()

router.get("/user", auth, async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json({
            statusCode: 200,
            status: "Success",
            data: users,
            message: "Users fetched successfully"
        })
    } catch (err) {
        res.status(400).json({
            statusCode: 400,
            status: "Error",
            data: null,
            message: err.message
        })
    }
})

router.get("/user/:id", auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (user) {
            res.status(200).json({
                statusCode: 200,
                status: "Success",
                data: user,
                message: "User fetched successfully"
            })

        }
    } catch (err) {
        res.status(400).json({
            statusCode: 400,
            status: "Error",
            data: null,
            message: "User not found"
        })
    }
})

router.post("/user", auth, async (req, res) => {
    const user = new User(req.body)
    // console.log(user)
    try {
        await user.save()
        res.status(201).json({
            statusCode: 201,
            status: "Success",
            data: user,
            message: "User created successfully",
        })
    } catch (err) {
        res.status(400).json({
            statusCode: 400,
            status: "Error",
            data: null,
            message: "User already exists"
        })
    }
})

router.post('/user/:id/avatar', auth, multerUploader.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    if (req.user.avatar != null) {
        req.user.avatar = null
    }
    req.user.avatar = buffer
    req.user.avatarExists = true
    await req.user.save()
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

router.get('/user/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            res.status(404).json({
                statusCode: 404,
                status: "Avatar not found",
                data: null,
            })
        }
        if (user) {
            // res.set('Content-Type', 'image/jpg')
            res.status(200).json({
                statusCode: 200,
                status: "Success",
                data: user.avatar,
                message: "User avatar fetched successfully"
            })
        }
    } catch (err) {
        res.status(400).json({
            statusCode: 400,
            status: "Error",
            data: null,
            message: err.message
        })
    }
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            res.status(404).send()
        }
        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

router.delete("/user/:id", auth, async (req, res) => {
    try {
        const user = await User.findByIdAndRemove(req.params.id)
        if (!user) {
            res.status(404).json({
                statusCode: 404,
                status: "Error",
                data: null,
                message: "User not found"
            })
        }
        res.status(200).json({
            statusCode: 200,
            status: "Success",
            token: user,
            message: "User deleted successfully",
        })
    } catch (err) {
        res.status(400).json({
            statusCode: 400,
            status: "Error",
            data: null,
            message: err.message
        })
    }
})

module.exports = router