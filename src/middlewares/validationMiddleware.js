const { validateName, validateEmail, validatePswd } = require('../utils/validations');
const { wrapMiddleware } = require('../utils/asyncwrappers');
const CustomError = require('../utils/CustomError');

const signUpValidationMW = wrapMiddleware(async (req, res, next) => {
    console.log('signUpvalidationMW()');

    let { fname, lname, email, password } = req.body;

    if (!validateEmail(email) || !validateName(fname) || !validateName(lname) || !validatePswd(password)) {
        throw new CustomError('Invalid form data', 401);
    };
    next();
}
);

const loginValidationMW = wrapMiddleware(async (req, res, next) => {
    console.log('loginValidationMW()');

    let { email, password } = req.body;

    if (!(validateEmail(email)) || !(validatePswd(password))) {
        throw new CustomError('Invalid form data', 401)
    }

    next();
});

module.exports = { signUpValidationMW, loginValidationMW };

