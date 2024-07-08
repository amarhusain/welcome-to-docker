import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import authMiddleware from "../middleware/auth.middleware";

const authRouter = Router();

authRouter.post('/signup', authMiddleware.validateSignupRequestBodyFields, authController.signup);
authRouter.post('/signin', authMiddleware.validateSigninRequestBodyFields, authController.signin);
authRouter.post('/send-password-reset-mail', authMiddleware.validateSendPasswordResetMailRequestBodyFields, authController.sendPasswordResetMailRequest);
authRouter.post('/reset-password', authMiddleware.validateResetPasswordRequestBodyFields, authController.resetPasswordRequest);
authRouter.post('/signin', authMiddleware.validateSigninRequestBodyFields, authController.signin);
authRouter.get('/doctor-list', authController.getDoctorList);

export default authRouter;
