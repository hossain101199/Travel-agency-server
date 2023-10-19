"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const booking_controller_1 = require("./booking.controller");
const booking_validation_1 = require("./booking.validation");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(client_1.UserRole.CUSTOMER), (0, validateRequest_1.default)(booking_validation_1.bookingValidation.createBookingZodSchema), booking_controller_1.bookingController.createBooking);
router.get('/:id', (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.CUSTOMER), booking_controller_1.bookingController.getSingleBooking);
router.patch('/:id', (0, validateRequest_1.default)(booking_validation_1.bookingValidation.updateBookingZodSchema), (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.CUSTOMER), booking_controller_1.bookingController.updateBooking);
router.get('/', (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.CUSTOMER), booking_controller_1.bookingController.getAllBookings);
exports.bookingRoutes = router;
