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
exports.reviewService = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const review_constant_1 = require("./review.constant");
const createReviewInDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isBooking = yield prisma_1.default.booking.findMany({
        where: {
            userId: user.id,
            serviceId: payload.serviceId,
        },
    });
    if (!isBooking || isBooking.length === 0) {
        throw new ApiError_1.default(401, 'You are not authorized or no bookings found for the user');
    }
    payload.userId = user.id;
    const result = yield prisma_1.default.review.create({
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
});
const deleteReviewFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.review.delete({
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
});
const getAllReviewsFromDB = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: review_constant_1.reviewSearchableFields.map(field => ({
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
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const result = yield prisma_1.default.review.findMany({
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
    const total = yield prisma_1.default.review.count();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
exports.reviewService = {
    createReviewInDB,
    deleteReviewFromDB,
    getAllReviewsFromDB,
};
