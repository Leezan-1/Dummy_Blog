const { wrapController } = require("../utils/asyncwrappers");

const getAllBlogs = wrapController(async (req, res) => {

});

module.exports = { getAllBlogs };