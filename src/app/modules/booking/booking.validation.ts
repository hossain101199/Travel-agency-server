import { z } from 'zod';

const createBookingZodSchema = z.object({
  body: z.object({
    travelDate: z
      .string()
      .transform(str => new Date(str))
      .refine(date => date > new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), {
        message: 'Travel date must be at least 2 days after today',
      }),
    numberOfPeople: z.number().refine(value => value >= 1, {
      message: 'Number of people must be greater than or equal to 1',
    }),
    serviceId: z.string({ required_error: 'Service ID is required' }),
  }),
});

export const bookingValidation = {
  createBookingZodSchema,
};
