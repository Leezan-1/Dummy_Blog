const express = require('express');
const router = express.Router();

const { signUpController, loginUserController } = require('../controllers/authController');
const { signUpValidationMW, loginValidationMW } = require('../middlewares/validationMiddleware');

router.route('/signup').post(signUpValidationMW, signUpController);
router.route('/login').post(loginValidationMW, loginUserController);

module.exports = router;