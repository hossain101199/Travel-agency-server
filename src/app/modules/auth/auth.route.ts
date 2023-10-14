import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { userValidation } from '../user/user.validation';
import { authController } from './auth.controller';
import { authValidation } from './auth.validation';

const router = express.Router();

router.post(
  '/signup',
  validateRequest(userValidation.createUserZodSchema),
  authController.createUser
);

router.post(
  '/signin',
  validateRequest(authValidation.loginZodSchema),
  authController.loginUser
);

router.post(
  '/refresh-token',
  validateRequest(authValidation.refreshTokenZodSchema),
  authController.refreshToken
);

router.post(
  '/change-password',
  validateRequest(authValidation.changePasswordZodSchema),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CUSTOMER),
  authController.changePassword
);

export const authRoutes = router;
