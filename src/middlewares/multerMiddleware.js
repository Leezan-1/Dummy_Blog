const { uploadBlogImage } = require("../config/multer-conf");

const MAX_NUM_IMAGES_ALLOWED = 5;
const uploadBlogImagesMW = uploadBlogImage.array('blog-images', MAX_NUM_IMAGES_ALLOWED);

module.exports = { uploadBlogImagesMW };
