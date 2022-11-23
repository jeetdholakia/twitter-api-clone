const mongoose = require('mongoose')

const schema = new mongoose.Schema({ text: 'string'}, { user: 'string'}, { userName: 'string'}, { image: Buffer}, { likes: Array, default: []}, {
    timestamps: true
})
const Tweet = mongoose.model('Tweet', schema)

module.exports = Tweet