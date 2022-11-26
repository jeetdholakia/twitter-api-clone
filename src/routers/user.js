const express = require("express")
const User = require("../models/user")
const jwt = require("jsonwebtoken")
const auth = require("../middleware/auth")

const router = new express.Router()

router.post("/auth", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        if (user) {
            res.status(200).json({
                statusCode: 200,
                status: "success",
                token: token,
                message: "Logged in successfully"
            })
        }
    } catch (err) {
        console.log(err)
        res.status(400).json({
            statusCode: 400,
            status: "Error",
            data: null,
            message: err.message,
        })
    }
})

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

router.delete("/user/:id", auth, async (req, res) => {
    try {
        const user = await User.findByIdAndRemove(req.params.id)
        if(!user) {
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