const CustomError = require("./CustomError");

// validates user's name
function validateName(name) {
    const nameRegex = /^[A-Za-z]{2,50}$/; // Allows only letters, between 2 to 50 characters
    if (nameRegex.test(name))
        return name;
    throw new CustomError('Please Enter Valid Name!', 400);
}

// validates user's email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Standard email format validation
    if (emailRegex.test(email))
        return email;
    throw new CustomError('Please Enter Valid Email!', 400);
}

// validates user's password
function validatePswd(pswd) {
    const passwordRegex = /^.{8,20}$/; // Ensures password length is between 8 to 20 characters
    if (passwordRegex.test(pswd))
        return pswd;
    throw new CustomError('Please Enter Valid Password!', 400);
}

// validates title of blog post
function validatePostTitle(title) {

    const titleRegex = /^(?=.{10,100}$)[A-Za-z0-9\s\.,!?'"-]+$/;
    // title should be 10-100 characters long
    // allowed characters : letters, numbers, spaces,  . , ! ? ' " -
    if (title && titleRegex.test(title))
        return title;
    throw new CustomError('Invalid Post Title: Title must be 10 - 100 character long.', 406);

}

// validates excerpt of blog post
function validatePostExcerpt(excerpt) {
    // Excerpt must be provided and its length should be between 30 and 150 characters.

    const excerptRegex = /^(?=.{30,150}$)[\s\S]+$/;
    if (excerpt && excerptRegex.test(excerpt)) {
        return excerpt;
    }
    throw new CustomError('Invalid Post Excerpt: Excerpt must be 30 to 150 character long.', 406);
}

function validateTagName(tagName) {
    const tagNameRegex = /^[A-Za-z]{1,15}$/;
    if (tagName && tagNameRegex.test(tagName))
        return tagName;
    throw new CustomError('Invalid Tag Name: Tag name must be aphabet and only 15 character long.', 400);
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
    validateTagName
}