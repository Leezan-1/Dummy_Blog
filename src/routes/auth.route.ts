import express from 'express';
const router = express.Router();

import { signUpCTLR, loginUserCTLR, logoutUserCTLR, generateRefreshCTLR } from '../controllers/auth.controller';
import { authTokenMW } from '../middlewares/authToken.middleware';

// handles 'auth/signup' route. 
router.route('/signup').post(signUpCTLR);

// handles 'auth/login' route 
router.route('/login').post(loginUserCTLR);

// handles 'auth/logout' route
router.route('/logout').get(authTokenMW, logoutUserCTLR);

// handles 'auth/refresh' route
router.route('/refresh').get(generateRefreshCTLR);

export default router;