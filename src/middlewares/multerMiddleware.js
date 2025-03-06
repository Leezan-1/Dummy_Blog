const { uploadBlogImage } = require("../config/multer-conf");
const { wrapMiddleware } = require("../utils/asyncwrappers");

const uploadBlogImagesMW = uploadBlogImage.array('blog-images', 5);

module.exports = { uploadBlogImagesMW };
