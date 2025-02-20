const { validateName, validateEmail, validatePswd } = require('../utils/validations');
const { wrapMiddleware } = require('../utils/asyncwrappers');

const validationMW = wrapMiddleware(async (req, res, next) => {
    console.log('validationMW()');

    let { fname, lname, email, password } = req.body;

    if (!validateEmail(email) || !validateName(fname) || !validateName(lname) || !validatePswd(password)) {
        res.status(401).json({ message: "invalid form data" });
    }
    next();
}
);

module.exports = { validationMW };

