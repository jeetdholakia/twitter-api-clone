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
            res.status(500).json({
                statusCode: 500,
                status: "Error",
                data: null,
                message: err.message
            })
        }
    } else {
        res.status(403).json({
            statusCode: 403,
            status: "Error",
            data: null,
            message: "You cannot follow yourself"
        })
    }
});

router.put("/:id/unfollow", auth, async (req, res) => {
    const requestingUserId = req.params.id
    const currentUserId = req.body.user.id

    if (currentUserId !== requestingUserId) {
      try {
        const user = await User.findById(requestingUserId);
        const currentUser = await User.findById(currentUserId);
        if (user.followers.includes(currentUserId)) {
          await user.updateOne({ $pull: { followers: currentUserId } });
          await currentUser.updateOne({ $pull: { followings: requestingUserId } });
            res.status(200).json({
                statusCode: 200,
                status: "Success",
                data: user,
                message: "User unfollowed successfully"
            })
        } else {
            res.status(403).json({
                statusCode: 403,
                status: "Error",
                data: null,
                message: "You don't follow this user"
            })
        }
      } catch (err) {
          res.status(500).json({
              statusCode: 500,
              status: "Error",
              data: null,
              message: err.message
          })
      }
    } else {
        res.status(403).json({
            statusCode: 403,
            status: "Error",
            data: null,
            message: "You cannot unfollow yourself"
        })
    }
  });

module.exports = router