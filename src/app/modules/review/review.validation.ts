import { z } from 'zod';

const createReviewZodSchema = z.object({
  body: z.object({
    rating: z
      .number({
        required_error: 'Rating is required',
      })
      .min(1)
      .max(5),
    comment: z.string({
      required_error: 'Comment is required',
    }),
    serviceId: z.string({
      required_error: 'serviceId is required',
    }),
  }),
});

export const reviewValidation = {
  createReviewZodSchema,
};
