import express from 'express';
import { authRoutes } from '../modules/auth/auth.route';
import { bookingRoutes } from '../modules/booking/booking.route';
import { categoryRoutes } from '../modules/category/category.route';
import { profileRoutes } from '../modules/profile/profile.route';
import { reviewRoutes } from '../modules/review/review.route';
import { serviceRoutes } from '../modules/service/service.route';
import { userRoutes } from '../modules/user/user.route';

const routes = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/profile',
    route: profileRoutes,
  },
  {
    path: '/categories',
    route: categoryRoutes,
  },
  {
    path: '/service',
    route: serviceRoutes,
  },
  {
    path: '/bookings',
    route: bookingRoutes,
  },
  {
    path: '/reviews',
    route: reviewRoutes,
  },
];

moduleRoutes.forEach(route => routes.use(route.path, route.route));

export default routes;
