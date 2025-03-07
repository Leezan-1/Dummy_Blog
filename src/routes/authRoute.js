const express = require('express');
const router = express.Router();

// importing necessary controller for user authentication .
const { signUpCTLR, loginUserCTLR, generateRefreshCTLR, logoutUserCTRL } = require('../controllers/authController');
// importing middlewares for user authentication.
const { validateSignUpMW, validateLoginMW } = require('../middlewares/validationMiddleware');
const { authTokenMW } = require('../middlewares/jwtMiddleware');

// handles 'auth/signup' route. 
router.route('/signup').post(validateSignUpMW, signUpCTLR);

// handles 'auth/login' route 
router.route('/login').post(validateLoginMW, loginUserCTLR);

// handles 'auth/logout' route
router.route('/logout').get(authTokenMW, logoutUserCTRL);

// handles 'auth/refresh' route
router.route('/refresh').get(generateRefreshCTLR);

module.exports = router;