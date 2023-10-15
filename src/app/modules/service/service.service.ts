import { Prisma, Service } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { serviceSearchableFields } from './service.constant';
import { IServiceFilters } from './service.interface';

const createServiceInDB = async (payload: Service): Promise<Service> => {
  const result = await prisma.service.create({
    data: payload,
    include: { category: true },
  });

  return result;
};

const getSingleServiceFromDB = async (
  payload: string
): Promise<Service | null> => {
  const result = await prisma.service.findUnique({
    where: {
      id: payload,
    },

    include: { category: true },
  });

  return result;
};

const getServicesByCategoryFromDB = async (
  payload: string
): Promise<Service[] | null> => {
  const result = await prisma.service.findMany({
    where: {
      categoryId: payload,
    },

    include: { category: true },
  });

  return result;
};

const updateServiceInDB = async (
  id: string,
  payload: Partial<Service>
): Promise<Service> => {
  const result = await prisma.service.update({
    where: {
      id,
    },

    data: payload,

    include: { category: true },
  });

  return result;
};

const deleteServiceFromDB = async (payload: string): Promise<Service> => {
  const result = await prisma.service.delete({
    where: {
      id: payload,
    },

    include: { category: true },
  });

  return result;
};

const getAllServicesFromDB = async (
  filters: IServiceFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Service[]>> => {
  const { searchTerm, minPrice, maxPrice, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: serviceSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (minPrice && maxPrice) {
    andConditions.push({
      price: {
        gte: Number(minPrice),
        lte: Number(maxPrice),
      },
    });
  } else if (minPrice) {
    andConditions.push({
      price: {
        gte: Number(minPrice),
      },
    });
  } else if (maxPrice) {
    andConditions.push({
      price: {
        lte: Number(maxPrice),
      },
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

  const whereConditions: Prisma.ServiceWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const sortConditions: { [key: string]: string } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await prisma.service.findMany({
    where: whereConditions,
    include: { category: true },
    skip,
    take: limit,
    orderBy: sortConditions,
  });

  const total = await prisma.service.count();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const serviceService = {
  createServiceInDB,
  getSingleServiceFromDB,
  getServicesByCategoryFromDB,
  updateServiceInDB,
  deleteServiceFromDB,
  getAllServicesFromDB,
};
