const express = require("express")
require('./db/mongoose')
require('dotenv').config()

const userRouter = require("./routers/user")
const authRouter = require("./routers/auth")
const followRouter = require("./routers/follow")
const tweetRouter = require("./routers/tweet")
const notificationRouter = require("./routers/notification")

const app = express()
const port = process.env.port || 3000

app.use(express.json())
app.use(authRouter)
app.use(userRouter)
app.use(followRouter)
app.use(tweetRouter)
app.use(notificationRouter)

app.listen(port, () => {
    console.log("Twitter API Started on port: " + port)
})