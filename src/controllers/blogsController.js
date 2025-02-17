const { wrapController } = require("../utils/asyncwrappers");

const getAllBlogs = wrapController(async (req, res) => {
    res.send('getAllBlogs()');
});

module.exports = { getAllBlogs };