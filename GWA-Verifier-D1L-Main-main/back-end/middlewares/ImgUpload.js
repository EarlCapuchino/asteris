// Imports
const multer = require('multer');

// Configure multer storage options
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "../front-end/src/images/user_dp");
    },
    filename: (req, file, cb) => {
        cb(null,file.originalname);
    }
});

// Configure allowed mime types (allow images only)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    else {
        cb(JSON.stringify({message: "Invalid file type"}), false);
    }
}

exports.upload = multer({
    storage,
    fileFilter
});