const express = require("express")
const User = require("../models/user")
const auth = require("../middleware/auth");

const router = express.Router()

router.put("/:id/follow", auth, async (req, res) => {
    const currentUserId = req.body.user.id
    const requestingUserId = req.params.id
    if (currentUserId !== req.params.id) {
        try {
            const user = await User.findById(requestingUserId);
            const currentUser = await User.findById(currentUserId);
            if (!user.followers.includes(currentUserId)) {
                await user.updateOne({$push: {followers: currentUserId}});
                await currentUser.updateOne({$push: {followings: requestingUserId}});
                res.status(200).json({
                    statusCode: 200,
                    status: "Success",
                    data: user,
                    message: "User followed successfully"
                })
            } else {
                res.status(403).json({
                    statusCode: 403,
                    status: "Error",
                    data: null,
                    message: "User already followed"
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
    } else {
        res.status(403).json("you cant follow yourself");
    }
});

module.exports = router