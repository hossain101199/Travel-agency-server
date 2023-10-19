"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createBookingZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        travelDate: zod_1.z
            .string()
            .transform(str => new Date(str))
            .refine(date => date > new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), {
            message: 'Travel date must be at least 2 days after today',
        }),
        numberOfPeople: zod_1.z.number().refine(value => value >= 1, {
            message: 'Number of people must be greater than or equal to 1',
        }),
        serviceId: zod_1.z.string({ required_error: 'Service ID is required' }),
    }),
});
const updateBookingZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        travelDate: zod_1.z
            .string()
            .transform(str => new Date(str))
            .refine(date => date > new Date(), {
            message: 'Travel date is less than today',
        })
            .optional(),
        status: zod_1.z
            .enum([
            client_1.BookingStatus.CANCELED,
            client_1.BookingStatus.CONFIRMED,
            client_1.BookingStatus.PENDING,
        ])
            .optional(),
    }),
});
exports.bookingValidation = {
    createBookingZodSchema,
    updateBookingZodSchema,
};
