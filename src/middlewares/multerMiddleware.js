const { uploadBlogImage, uploadUserImage } = require("../config/multer-conf");

const MAX_NUM_IMAGES_ALLOWED = 5;

const uploadBlogImagesMW = uploadBlogImage.fields([
    { name: 'thumbnail-image', maxCount: 1 },
    { name: 'blog-images', maxCount: MAX_NUM_IMAGES_ALLOWED },
]);
const uploadUserImageMW = uploadUserImage.single('user-profile-image');
module.exports = { uploadBlogImagesMW, uploadUserImageMW };
