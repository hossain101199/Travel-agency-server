import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { bookingController } from './booking.controller';
import { bookingValidation } from './booking.validation';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.CUSTOMER),
  validateRequest(bookingValidation.createBookingZodSchema),
  bookingController.createBooking
);

router.get(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CUSTOMER),
  bookingController.getSingleBooking
);

router.patch(
  '/:id',
  validateRequest(bookingValidation.updateBookingZodSchema),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CUSTOMER),
  bookingController.updateBooking
);

router.get(
  '/',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CUSTOMER),
  bookingController.getAllBookings
);

export const bookingRoutes = router;
