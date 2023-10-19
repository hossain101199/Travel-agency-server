import { Prisma, Review } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { reviewSearchableFields } from './review.constant';
import { IReviewFilters } from './review.interface';

const createReviewInDB = async (
  user: JwtPayload,
  payload: Review
): Promise<Review> => {
  const isBooking = await prisma.booking.findMany({
    where: {
      userId: user.id,
      serviceId: payload.serviceId,
    },
  });

  if (!isBooking || isBooking.length === 0) {
    throw new ApiError(
      401,
      'You are not authorized or no bookings found for the user'
    );
  }

  payload.userId = user.id;
  const result = await prisma.review.create({
    data: payload,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          contactNo: true,
          address: true,
          profileImg: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      service: true,
    },
  });

  return result;
};

const deleteReviewFromDB = async (payload: string): Promise<Review> => {
  const result = await prisma.review.delete({
    where: {
      id: payload,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          contactNo: true,
          address: true,
          profileImg: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      service: true,
    },
  });

  return result;
};

const getAllReviewsFromDB = async (
  filters: IReviewFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Review[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: reviewSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      AND: Object.entries(filtersData).map(([field, value]) => ({
        [field]: {
          equals: value,
        },
      })),
    });
  }

  const whereConditions: Prisma.ReviewWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const sortConditions: { [key: string]: string } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await prisma.review.findMany({
    where: whereConditions,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          contactNo: true,
          address: true,
          profileImg: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      service: true,
    },
    skip,
    take: limit,
    orderBy: sortConditions,
  });

  const total = await prisma.review.count();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const reviewService = {
  createReviewInDB,
  deleteReviewFromDB,
  getAllReviewsFromDB,
};
