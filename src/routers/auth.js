const express = require("express")
const User = require("../models/user")

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

module.exports = router