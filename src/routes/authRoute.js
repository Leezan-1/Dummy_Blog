const express = require('express');
const router = express.Router();

const { signUpController } = require('../controllers/authController');
const { validationMW } = require('../middlewares/validationMiddleware');

router.route('/signup').post(validationMW, signUpController);

module.exports = router;