import { Server } from 'http';
import app from './app';
import config from './config/index';
import { errorLogger, infoLogger } from './shared/logger';
import prisma from './shared/prisma';

process.on('uncaughtException', error => {
  errorLogger.error(error);
  process.exit(1);
});

let server: Server;

async function main() {
  try {
    await prisma.$connect();

    server = app.listen(config.port, () => {
      infoLogger.info(
        `app listening on port ${config.port} | http://localhost:${config.port}`
      );
    });

    infoLogger.info('Database connected successfully');
  } catch (error) {
    errorLogger.error('Failed to connect database', error);
  }

  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        errorLogger.error(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

main();

process.on('SIGTERM', () => {
  infoLogger.info('SIGTERM is received');
  if (server) {
    server.close();
  }
});
