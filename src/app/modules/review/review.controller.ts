import { Review } from '@prisma/client';
import { RequestHandler } from 'express';
import { paginationFields } from '../../../constants/pagination';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { reviewFilterableFields } from './review.constant';
import { reviewService } from './review.service';

const createReview: RequestHandler = catchAsync(async (req, res) => {
  if (!req.verifiedUser) {
    throw new ApiError(403, 'Forbidden');
  }

  const user = req.verifiedUser;

  const reviewData = req.body;

  const result = await reviewService.createReviewInDB(user, reviewData);

  sendResponse<Review>(res, {
    statusCode: 200,
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});

const deleteReview: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await reviewService.deleteReviewFromDB(id);

  sendResponse<Review>(res, {
    statusCode: 200,
    success: true,
    message: 'Review deleted successfully',
    data: result,
  });
});

const getAllReviews: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, reviewFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await reviewService.getAllReviewsFromDB(
    filters,
    paginationOptions
  );

  sendResponse<Review[]>(res, {
    statusCode: 200,
    success: true,
    message: 'Reviews retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const reviewController = {
  createReview,
  deleteReview,
  getAllReviews,
};
