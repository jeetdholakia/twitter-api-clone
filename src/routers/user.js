const express = require("express")
const User = require("../models/user")
const jwt = require("jsonwebtoken")
const auth = require("../middleware/auth")

const router = new express.Router()

router.post("/user", auth, async (req, res) => {
    const user = new User(req.body)
    // console.log(user)
    try {
        await user.save()
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: user
        })
    } catch (err) {
        res.status(400).send("User already exists")
        res.status(400).json({
            statusCode: 400,
            status: "Error",
            message: "User already exists"
        })
    }
})

router.get("/user", async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).send(users)
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post("/auth", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        if (user) {
            res.status(200).json({
                statusCode: 200,
                status: "success",
                token: token
            })
        }
    } catch (err) {
        console.log(err)
        res.status(400).send("User not found")
    }
})

module.exports = router