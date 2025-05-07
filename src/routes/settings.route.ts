// built-in & third party modules
import { Router } from 'express';

// controllers
import { regeneratePasswordCTLR, resetPasswordCTLR } from '../controllers/auth.controller';

// middlewares
import { validateOtpMW } from '../middlewares/validateOtp.middleware';

const router = Router();

// routes
router.route('/reset-password').post(resetPasswordCTLR);

router.route('/new-password').post(validateOtpMW, regeneratePasswordCTLR);

export default router;