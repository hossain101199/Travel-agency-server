"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewValidation = void 0;
const zod_1 = require("zod");
const createReviewZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        rating: zod_1.z
            .number({
            required_error: 'Rating is required',
        })
            .min(1)
            .max(5),
        comment: zod_1.z.string({
            required_error: 'Comment is required',
        }),
        serviceId: zod_1.z.string({
            required_error: 'serviceId is required',
        }),
    }),
});
exports.reviewValidation = {
    createReviewZodSchema,
};
