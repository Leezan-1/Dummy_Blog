const CustomError = require("./CustomError");

// validates user's name
function validateName(name) {
    const nameRegex = /^[A-Za-z]{2,50}$/; // Allows only letters, between 2 to 50 characters
    return nameRegex.test(name);
}

// validates user's email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Standard email format validation
    let isValid = emailRegex.test(email);
    return isValid
}

// validates user's password
function validatePswd(pswd) {
    const passwordRegex = /^.{8,20}$/; // Ensures password length is between 8 to 20 characters
    return passwordRegex.test(pswd);
}

// validates title of blog post
function validatePostTitle(title) {

    const titleRegex = /^(?=.{10,100}$)[A-Za-z0-9\s\.,!?'"-]+$/;
    // title should be 10-100 characters long
    // allowed characters : letters, numbers, spaces,  . , ! ? ' " -
    if (title && titleRegex.test(title))
        return true;
    throw new CustomError('Invalid Post Title', 406);

}

// validates excerpt of blog post
function validatePostExcerpt(excerpt) {
    // Excerpt must be provided and its length should be between 30 and 150 characters.

    const excerptRegex = /^(?=.{30,150}$)[\s\S]+$/;
    if (excerpt && excerptRegex.test(excerpt)) {
        return true;
    }
    throw new CustomError('Invalid Post Excerpt', 406);
}


// validates description of blog post
// function validatePostDesc(desc) {
//     throw new CustomError('Invalid Post Description', 406)
// }

module.exports = {
    validateName,
    validateEmail,
    validatePswd,
    validatePostTitle,
    validatePostExcerpt,
}