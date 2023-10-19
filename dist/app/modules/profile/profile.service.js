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
exports.profileService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const getProfileFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUnique({
        where: {
            id: payload,
        },
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
    });
    return result;
});
const updateProfileInDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const allowedFields = ['name', 'email', 'contactNo', 'address', 'profileImg'];
    // Filter the payload to only include allowed fields
    const filteredPayload = Object.keys(payload)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
        obj[key] = payload[key];
        return obj;
    }, {});
    const result = yield prisma_1.default.user.update({
        where: {
            id: user === null || user === void 0 ? void 0 : user.id,
        },
        data: filteredPayload,
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
    });
    return result;
});
exports.profileService = {
    getProfileFromDB,
    updateProfileInDB,
};
