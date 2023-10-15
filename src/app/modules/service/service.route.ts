import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { serviceController } from './service.controller';
import { serviceValidation } from './service.validation';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(serviceValidation.createServiceZodSchema),
  serviceController.createService
);

router.get('/:id', serviceController.getSingleService);

router.get('/category/:categoryId/', serviceController.getServicesByCategory);

router.patch(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(serviceValidation.updateServiceZodSchema),
  serviceController.updateService
);

router.delete(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  serviceController.deleteService
);

router.get('/', serviceController.getAllServices);

export const serviceRoutes = router;
