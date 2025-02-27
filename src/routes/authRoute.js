const express = require('express');
const router = express.Router();

const { signUpController, loginUserController } = require('../controllers/authController');
const { validationMW } = require('../middlewares/validationMiddleware');

router.route('/signup').post(validationMW, signUpController);
router.route('/login').post(validationMW, loginUserController);

module.exports = router;