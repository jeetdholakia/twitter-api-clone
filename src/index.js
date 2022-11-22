const express = require("express")

const app = express()
const port = process.env.port || 3000

app.use(express.json())

app.listen(port, () => {
    console.log("Twitter API Started on port: " + port)
})