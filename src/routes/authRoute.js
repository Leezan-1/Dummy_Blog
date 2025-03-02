const express = require('express');
const router = express.Router();

const { signUpCTLR, loginUserCTLR, generateRefreshCTLR, logoutUserCTRL } = require('../controllers/authController');
const { validateSignUpMW, validateLoginMW } = require('../middlewares/validationMiddleware');
const { authTokenMW } = require('../middlewares/jwtMiddleware');

router.route('/signup').post(validateSignUpMW, signUpCTLR);

router.route('/login').post(validateLoginMW, loginUserCTLR);

router.route('/logout').get(authTokenMW, logoutUserCTRL);

router.route('/refresh').get(generateRefreshCTLR);

module.exports = router;