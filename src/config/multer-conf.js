const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// config file filer where user can send only image file.
const imageFileFilter = (req, file, cb) => {
    const allowedType = ["image/jpeg", "image/png", "image/gif"];
    if (allowedType.includes(file.mimetype))
        cb(null, true);
    else
        cb(new Error("Only image type files are allowed"));
};

// configs disk storage for blog post's images when user sends it through post form.
const blogImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadDir = path.resolve(__dirname, '../public/uploads/blog_images');
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {

        crypto.randomBytes(16, (err, buffer) => {
            if (err)
                cb(err);

            let fileName = buffer.toString('hex') + '-' + file.originalname;
            cb(null, fileName);
        })
    }
});

// configs disk storage for user profile's images when user sends it through form.
const userImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadDir = path.resolve(__dirname, '../public/uploads/user_images');
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        crypto.randomBytes(8, (err, buffer) => {
            if (err)
                cb(err);

            let fileName = buffer.toString('hex') + '-' + file.originalname;
            cb(null, fileName);
        })
    }
});


// The multer config for blog post's image file
const uploadBlogImage = multer({
    storage: blogImageStorage,
    fileFilter: imageFileFilter,
    limits: {
        // 5MB size for user profile image
        fileSize: 5 * 1024 * 1024
    },
});

// The multer config for user post's image file
const uploadUserImage = multer({
    storage: userImageStorage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 3 * 1024 * 1025
        // 3MB size for user profile image
    }
})

module.exports = { uploadBlogImage, uploadUserImage };