const express = require('express');
const router = express.Router();

const { signUpController } = require('../controllers/authController');

router.route('/signup').post(signUpController);

module.exports = router;