const { wrapController } = require("../utils/asyncwrappers");

const signUpController = wrapController(async (req, res) => {
    res.send(req.method, 'signUpController()');
});

module.exports = { signUpController };