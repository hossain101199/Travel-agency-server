"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceController = void 0;
const pagination_1 = require("../../../constants/pagination");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const service_constant_1 = require("./service.constant");
const service_service_1 = require("./service.service");
const createService = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceData = req.body;
    const result = yield service_service_1.serviceService.createServiceInDB(serviceData);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Service created successfully',
        data: result,
    });
}));
const getSingleService = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield service_service_1.serviceService.getSingleServiceFromDB(id);
    if (result === null) {
        (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: `Error: Service with ID ${id} is not found. Please verify the provided ID and try again`,
            data: result,
        });
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Service retrieved successfully',
            data: result,
        });
    }
}));
const getServicesByCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.params;
    const result = yield service_service_1.serviceService.getServicesByCategoryFromDB(categoryId);
    if (result === null) {
        (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: `Error: Service with category ID ${categoryId} is not found. Please verify the provided ID and try again`,
            data: result,
        });
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Service retrieved successfully',
            data: result,
        });
    }
}));
const updateService = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updatedServiceData = req.body;
    const result = yield service_service_1.serviceService.updateServiceInDB(id, updatedServiceData);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Service updated successfully',
        data: result,
    });
}));
const deleteService = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield service_service_1.serviceService.deleteServiceFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Service deleted successfully',
        data: result,
    });
}));
const getAllServices = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, service_constant_1.serviceFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield service_service_1.serviceService.getAllServicesFromDB(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Services retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
}));
exports.serviceController = {
    createService,
    getSingleService,
    getServicesByCategory,
    updateService,
    deleteService,
    getAllServices,
};
