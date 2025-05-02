import { Router } from 'express';
import { regeneratePasswordCTLR, resetPasswordCTLR, validateOtpCTLR } from '../controllers/settings.controller';

const router = Router();

// handles 
router.route('/reset-password').post(resetPasswordCTLR);

router.route("/verify-otp").post(validateOtpCTLR);

router.route('/new-password').post(regeneratePasswordCTLR);

export default router;