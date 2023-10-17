import { Booking } from '@prisma/client';
import { RequestHandler } from 'express';
import { paginationFields } from '../../../constants/pagination';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { bookingFilterableFields } from './booking.constant';
import { bookingService } from './booking.service';

const createBooking: RequestHandler = catchAsync(async (req, res) => {
  if (!req.verifiedUser) {
    throw new ApiError(403, 'Forbidden');
  }

  const { id: userId } = req.verifiedUser;

  const bookingData = req.body;

  const result = await bookingService.createBookingInDB(userId, bookingData);

  sendResponse<Booking>(res, {
    statusCode: 200,
    success: true,
    message: 'Booking created successfully',
    data: result,
  });
});

const getSingleBooking: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  if (!req.verifiedUser) {
    throw new ApiError(403, 'Forbidden');
  }

  const user = req.verifiedUser;
  const result = await bookingService.getSingleBookingFromDB(id, user);

  if (result === null) {
    sendResponse<Booking>(res, {
      statusCode: 404,
      success: false,
      message: `Error: Booking with ID ${id} is not found. Please verify the provided ID and try again`,
      data: result,
    });
  } else {
    sendResponse<Booking>(res, {
      statusCode: 200,
      success: true,
      message: 'Booking retrieved successfully',
      data: result,
    });
  }
});

const updateBooking: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  if (!req.verifiedUser) {
    throw new ApiError(403, 'Forbidden');
  }

  const user = req.verifiedUser;
  const updatedData = req.body;

  const result = await bookingService.updateBookingInDB(id, user, updatedData);

  sendResponse<Booking>(res, {
    statusCode: 200,
    success: true,
    message: 'Booking updated successfully',
    data: result,
  });
});

const getAllBookings: RequestHandler = catchAsync(async (req, res) => {
  if (!req.verifiedUser) {
    throw new ApiError(403, 'Forbidden');
  }

  const user = req.verifiedUser;

  const filters = pick(req.query, bookingFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await bookingService.getAllBookingsFromDB(
    filters,
    paginationOptions,
    user
  );

  sendResponse<Booking[]>(res, {
    statusCode: 200,
    success: true,
    message: 'Bookings retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const bookingController = {
  createBooking,
  getSingleBooking,
  updateBooking,
  getAllBookings,
};
