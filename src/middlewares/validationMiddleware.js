const { wrapMiddleware } = require('../utils/asyncwrappers');
const CustomError = require('../utils/CustomError');
const {
    validateName,
    validateEmail,
    validatePswd,
    validatePostTitle,
    validatePostExcerpt,
    validatePostDesc
} = require('../utils/validations');


// middleware that validates the user signup form.
const validateSignUpMW = wrapMiddleware(async (req, res, next) => {
    let { fname, lname, email, password } = req.body;

    if (!validateEmail(email) || !validateName(fname) || !validateName(lname) || !validatePswd(password)) {
        throw new CustomError('Invalid form data', 401);
    };
    next();
}
);

// middleware that validates the user login form.
const validateLoginMW = wrapMiddleware(async (req, res, next) => {
    console.log('loginValidationMW()');

    let { email, password } = req.body;

    if (!(validateEmail(email)) || !(validatePswd(password))) {
        throw new CustomError('Invalid form data', 401)
    }

    next();
});

// middleware that validates the blog-post form.
const validatePostMW = wrapMiddleware(async (req, res, next) => {

    const { title, excerpt } = req.body;

    if (validatePostTitle(title) && validatePostExcerpt(excerpt))
        next();
    else
        throw new CustomError('Invalid form data provided', 406);

});

module.exports = { validateSignUpMW, validateLoginMW, validatePostMW };

