const multer = require('multer')

const multerUploader = multer({
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

module.exports = multerUploader