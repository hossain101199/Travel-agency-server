"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validation_1 = require("../user/user.validation");
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const router = express_1.default.Router();
router.post('/signup', (0, validateRequest_1.default)(user_validation_1.userValidation.createUserZodSchema), auth_controller_1.authController.createUser);
router.post('/signin', (0, validateRequest_1.default)(auth_validation_1.authValidation.loginZodSchema), auth_controller_1.authController.loginUser);
router.post('/refresh-token', (0, validateRequest_1.default)(auth_validation_1.authValidation.refreshTokenZodSchema), auth_controller_1.authController.refreshToken);
router.post('/change-password', (0, validateRequest_1.default)(auth_validation_1.authValidation.changePasswordZodSchema), (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.CUSTOMER), auth_controller_1.authController.changePassword);
exports.authRoutes = router;
