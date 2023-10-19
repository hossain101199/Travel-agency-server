"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingController = void 0;
const pagination_1 = require("../../../constants/pagination");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const booking_constant_1 = require("./booking.constant");
const booking_service_1 = require("./booking.service");
const createBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.verifiedUser) {
        throw new ApiError_1.default(403, 'Forbidden');
    }
    const { id: userId } = req.verifiedUser;
    const bookingData = req.body;
    const result = yield booking_service_1.bookingService.createBookingInDB(userId, bookingData);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Booking created successfully',
        data: result,
    });
}));
const getSingleBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!req.verifiedUser) {
        throw new ApiError_1.default(403, 'Forbidden');
    }
    const user = req.verifiedUser;
    const result = yield booking_service_1.bookingService.getSingleBookingFromDB(id, user);
    if (result === null) {
        (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: `Error: Booking with ID ${id} is not found. Please verify the provided ID and try again`,
            data: result,
        });
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Booking retrieved successfully',
            data: result,
        });
    }
}));
const updateBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!req.verifiedUser) {
        throw new ApiError_1.default(403, 'Forbidden');
    }
    const user = req.verifiedUser;
    const updatedData = req.body;
    const result = yield booking_service_1.bookingService.updateBookingInDB(id, user, updatedData);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Booking updated successfully',
        data: result,
    });
}));
const getAllBookings = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.verifiedUser) {
        throw new ApiError_1.default(403, 'Forbidden');
    }
    const user = req.verifiedUser;
    const filters = (0, pick_1.default)(req.query, booking_constant_1.bookingFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield booking_service_1.bookingService.getAllBookingsFromDB(filters, paginationOptions, user);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Bookings retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
}));
exports.bookingController = {
    createBooking,
    getSingleBooking,
    updateBooking,
    getAllBookings,
};
