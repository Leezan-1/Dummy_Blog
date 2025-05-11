// built-in & third party modules
import express from 'express';

// controllers 
import {
    signUpCTLR,
    loginUserCTLR,
    logoutUserCTLR,
    forgotPasswordCTLR,
    generateRefreshCTLR,
    regeneratePasswordCTLR,
    verifyEmailCTLR
} from '../controllers/auth.controller';

// middlewares
import { verifyOtpMW } from '../middlewares/validateOtp.middleware';
import { authTokenMW } from '../middlewares/authToken.middleware';


const router = express.Router();

// handles 'auth/signup' route. 
router.route('/signup').post(signUpCTLR);
router.route('/verify-email').post(verifyOtpMW, verifyEmailCTLR);

// handles 'auth/login' route 
router.route('/login').post(loginUserCTLR);

// handles 'auth/logout' route
router.route('/logout').get(authTokenMW, logoutUserCTLR);

// handles 'auth/refresh' route
router.route('/refresh').get(generateRefreshCTLR);

// routes
router.route('/forgot-password').post(forgotPasswordCTLR);

router.route('/reset-password').post(verifyOtpMW, regeneratePasswordCTLR);

export default router;