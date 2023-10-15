import { Service } from '@prisma/client';
import { RequestHandler } from 'express';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { serviceFilterableFields } from './service.constant';
import { serviceService } from './service.service';

const createService: RequestHandler = catchAsync(async (req, res) => {
  const serviceData = req.body;

  const result = await serviceService.createServiceInDB(serviceData);

  sendResponse<Service>(res, {
    statusCode: 200,
    success: true,
    message: 'Service created successfully',
    data: result,
  });
});

const getSingleService: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await serviceService.getSingleServiceFromDB(id);

  if (result === null) {
    sendResponse<Service>(res, {
      statusCode: 404,
      success: false,
      message: `Error: Service with ID ${id} is not found. Please verify the provided ID and try again`,
      data: result,
    });
  } else {
    sendResponse<Service>(res, {
      statusCode: 200,
      success: true,
      message: 'Service retrieved successfully',
      data: result,
    });
  }
});

const getServicesByCategory: RequestHandler = catchAsync(async (req, res) => {
  const { categoryId } = req.params;

  const result = await serviceService.getServicesByCategoryFromDB(categoryId);

  if (result === null) {
    sendResponse<Service[]>(res, {
      statusCode: 404,
      success: false,
      message: `Error: Service with category ID ${categoryId} is not found. Please verify the provided ID and try again`,
      data: result,
    });
  } else {
    sendResponse<Service[]>(res, {
      statusCode: 200,
      success: true,
      message: 'Service retrieved successfully',
      data: result,
    });
  }
});

const updateService: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const updatedServiceData = req.body;

  const result = await serviceService.updateServiceInDB(id, updatedServiceData);

  sendResponse<Service>(res, {
    statusCode: 200,
    success: true,
    message: 'Service updated successfully',
    data: result,
  });
});

const deleteService: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await serviceService.deleteServiceFromDB(id);

  sendResponse<Service>(res, {
    statusCode: 200,
    success: true,
    message: 'Service deleted successfully',
    data: result,
  });
});

const getAllServices: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, serviceFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await serviceService.getAllServicesFromDB(
    filters,
    paginationOptions
  );

  sendResponse<Service[]>(res, {
    statusCode: 200,
    success: true,
    message: 'Services retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const serviceController = {
  createService,
  getSingleService,
  getServicesByCategory,
  updateService,
  deleteService,
  getAllServices,
};
