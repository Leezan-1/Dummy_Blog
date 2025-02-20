function validateName(name) {
    console.log('validateName()');
    return true;
};
function validateEmail(email) {
    console.log('validateEmail()');
    return true;
};
function validatePswd(pswd) {
    console.log('validatePassword()');
    return true;
};

module.exports = { validateName, validateEmail, validatePswd }