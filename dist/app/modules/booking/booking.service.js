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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingService = void 0;
const client_1 = require("@prisma/client");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const booking_constant_1 = require("./booking.constant");
const createBookingInDB = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const service = yield prisma_1.default.service.findUnique({
        where: {
            id: payload.serviceId,
        },
    });
    if (!service) {
        throw new ApiError_1.default(404, 'Service not found');
    }
    const totalAmount = payload.numberOfPeople * service.price;
    try {
        const createdBooking = yield prisma_1.default.booking.create({
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
    }
    catch (error) {
        throw new Error('Error creating the booking.');
    }
});
const getSingleBookingFromDB = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    if (user.role === client_1.UserRole.CUSTOMER) {
        result = yield prisma_1.default.booking.findUnique({
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
            throw new ApiError_1.default(401, 'You are not authorized');
        }
    }
    else {
        result = yield prisma_1.default.booking.findUnique({
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
});
const updateBookingInDB = (id, user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const allowedFields = ['status', 'travelDate'];
    // Filter the payload to only include allowed fields
    const filteredPayload = Object.keys(payload)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
        obj[key] = payload[key];
        return obj;
    }, {});
    let result;
    if (user.role === client_1.UserRole.CUSTOMER) {
        result = yield prisma_1.default.booking.update({
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
    }
    else {
        result = yield prisma_1.default.booking.update({
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
});
const getAllBookingsFromDB = (filters, paginationOptions, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: booking_constant_1.bookingSearchableFields.map(field => ({
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
    let whereConditions;
    if (user.role === client_1.UserRole.CUSTOMER) {
        whereConditions =
            andConditions.length > 0
                ? {
                    AND: [...andConditions, { userId: user.id }],
                }
                : { userId: user.id };
    }
    else {
        whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    }
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const result = yield prisma_1.default.booking.findMany({
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
    const total = yield prisma_1.default.booking.count({ where: whereConditions });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
exports.bookingService = {
    createBookingInDB,
    getSingleBookingFromDB,
    updateBookingInDB,
    getAllBookingsFromDB,
};
