import express, { Router } from 'express';
const router: Router = express.Router();

import { signUpCTLR, loginUserCTLR, logoutUserCTLR, generateRefreshCTLR } from '../controllers/auth.controller';


// handles 'auth/signup' route. 
router.route('/signup').get(signUpCTLR); // to post

// handles 'auth/login' route 
router.route('/login').get(loginUserCTLR); //change it to post

// handles 'auth/logout' route
// router.route('/logout').get(authTokenMW, logoutUserCTRL);

// handles 'auth/refresh' route
router.route('/refresh').get(generateRefreshCTLR);

export default router;