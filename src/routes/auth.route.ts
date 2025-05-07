// built-in & third party modules
import express from 'express';

// controllers 
import {
    signUpCTLR,
    loginUserCTLR,
    logoutUserCTLR,
    resetPasswordCTLR,
    generateRefreshCTLR,
    regeneratePasswordCTLR
} from '../controllers/auth.controller';

// middlewares
import { validateOtpMW } from '../middlewares/validateOtp.middleware';
import { authTokenMW } from '../middlewares/authToken.middleware';


const router = express.Router();

// handles 'auth/signup' route. 
router.route('/signup').post(signUpCTLR);

// handles 'auth/login' route 
router.route('/login').post(loginUserCTLR);

// handles 'auth/logout' route
router.route('/logout').get(authTokenMW, logoutUserCTLR);

// handles 'auth/refresh' route
router.route('/refresh').get(generateRefreshCTLR);

// routes
router.route('/reset-password').post(resetPasswordCTLR);

router.route('/new-password').post(validateOtpMW, regeneratePasswordCTLR);

export default router;