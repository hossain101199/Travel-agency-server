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
const app_1 = __importDefault(require("./app"));
const index_1 = __importDefault(require("./config/index"));
const logger_1 = require("./shared/logger");
const prisma_1 = __importDefault(require("./shared/prisma"));
process.on('uncaughtException', error => {
    logger_1.errorLogger.error(error);
    process.exit(1);
});
let server;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prisma_1.default.$connect();
            server = app_1.default.listen(index_1.default.port, () => {
                logger_1.infoLogger.info(`app listening on port ${index_1.default.port} | http://localhost:${index_1.default.port}`);
            });
            logger_1.infoLogger.info('Database connected successfully');
        }
        catch (error) {
            logger_1.errorLogger.error('Failed to connect database', error);
        }
        process.on('unhandledRejection', error => {
            if (server) {
                server.close(() => {
                    logger_1.errorLogger.error(error);
                    process.exit(1);
                });
            }
            else {
                process.exit(1);
            }
        });
    });
}
main();
process.on('SIGTERM', () => {
    logger_1.infoLogger.info('SIGTERM is received');
    if (server) {
        server.close();
    }
});
