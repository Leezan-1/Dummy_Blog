function validateName(name) {
    const nameRegex = /^[A-Za-z]{2,50}$/; // Allows only letters, between 2 to 50 characters
    return nameRegex.test(name);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Standard email format validation
    let isValid = emailRegex.test(email);

    console.log('email,isvalid :>> ', email, isValid);
    return isValid
}

function validatePswd(pswd) {
    const passwordRegex = /^.{8,20}$/; // Ensures password length is between 8 to 20 characters
    return passwordRegex.test(pswd);
}

module.exports = { validateName, validateEmail, validatePswd }