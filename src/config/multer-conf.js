const multer = require('multer');
const path = require('path');


const blogImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadDir = path.resolve(__dirname, '../public/uploads/blog_images');
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        let fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
});
const userImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadDir = path.resolve(__dirname, '../public/uploads/user_images');
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        let fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
})

const imageFileFilter = (req, file, cb) => {
    const allowedType = ["image/jpeg", "image/png", "image/gif"];
    if (allowedType.includes(file.mimetype))
        cb(null, true);
    else
        cb(new Error("Only image type files are allowed"));
}


const uploadBlogImage = multer({
    storage: blogImageStorage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
});

const uploadUserImage = multer({
    storage: userImageStorage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 3 * 1024 * 1025 // 3MB size for user profile image
    }
})

module.exports = { uploadBlogImage, uploadUserImage };