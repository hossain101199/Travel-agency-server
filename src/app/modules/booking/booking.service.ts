import { Booking, Prisma, UserRole } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { bookingSearchableFields } from './booking.constant';
import { IBookingFilters } from './booking.interface';

const createBookingInDB = async (
  userId: string,
  payload: Booking
): Promise<Booking> => {
  const service = await prisma.service.findUnique({
    where: {
      id: payload.serviceId,
    },
  });

  if (!service) {
    throw new ApiError(404, 'Service not found');
  }

  const totalAmount = payload.numberOfPeople * service.price;

  try {
    const createdBooking = await prisma.booking.create({
      data: {
        travelDate: payload.travelDate,
        numberOfPeople: payload.numberOfPeople,
        totalAmount,
        userId,
        serviceId: payload.serviceId,
        payments: {
          createMany: {
            data: {
              paymentMethod: '',
              amount: totalAmount,
            },
          },
        },
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
        service: { include: { category: true } },
        payments: true,
      },
    });
    return createdBooking;
  } catch (error) {
    throw new Error('Error creating the booking.');
  }
};

const getSingleBookingFromDB = async (
  id: string,
  user: JwtPayload
): Promise<Booking | null> => {
  let result;

  if (user.role === UserRole.CUSTOMER) {
    result = await prisma.booking.findUnique({
      where: {
        id: id,
        userId: user.id,
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
        service: { include: { category: true } },
        payments: true,
      },
    });

    if (!result) {
      throw new ApiError(401, 'You are not authorized');
    }
  } else {
    result = await prisma.booking.findUnique({
      where: {
        id,
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
        service: { include: { category: true } },
        payments: true,
      },
    });
  }

  return result;
};

const updateBookingInDB = async (
  id: string,
  user: JwtPayload,
  payload: Partial<Booking>
): Promise<Booking> => {
  const allowedFields = ['status', 'travelDate'];

  // Filter the payload to only include allowed fields
  const filteredPayload: Partial<Booking> = Object.keys(payload)
    .filter(key => allowedFields.includes(key as keyof Booking))
    .reduce((obj, key) => {
      (obj as any)[key] = (payload as any)[key];
      return obj;
    }, {} as Partial<Booking>);

  let result;

  if (user.role === UserRole.CUSTOMER) {
    result = await prisma.booking.update({
      where: { id: id, userId: user.id },
      data: filteredPayload,
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
        service: { include: { category: true } },
        payments: true,
      },
    });
  } else {
    result = await prisma.booking.update({
      where: { id: id },
      data: filteredPayload,
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
        service: { include: { category: true } },
        payments: true,
      },
    });
  }

  return result;
};

const getAllBookingsFromDB = async (
  filters: IBookingFilters,
  paginationOptions: IPaginationOptions,
  user: JwtPayload
): Promise<IGenericResponse<Booking[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: bookingSearchableFields.map(field => ({
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

  let whereConditions: Prisma.BookingWhereInput;

  if (user.role === UserRole.CUSTOMER) {
    whereConditions =
      andConditions.length > 0
        ? {
            AND: [...andConditions, { userId: user.id }],
          }
        : { userId: user.id };
  } else {
    whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
  }

  const sortConditions: { [key: string]: string } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await prisma.booking.findMany({
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
      service: { include: { category: true } },
      payments: true,
    },
    skip,
    take: limit,
    orderBy: sortConditions,
  });

  const total = await prisma.booking.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const bookingService = {
  createBookingInDB,
  getSingleBookingFromDB,
  updateBookingInDB,
  getAllBookingsFromDB,
};
