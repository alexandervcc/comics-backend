import { registerAs } from '@nestjs/config';

export const configuration = registerAs('configuration', () => ({
  port: parseInt(process.env.AUTH_PORT),
  redis: {
    pass: process.env.REDIS_PASS,
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
  },
  mongo: {
    uri: process.env.AUTH_MONGO_URI,
    db: process.env.AUTH_DB,
  },
  security: {
    jwtSecret: process.env.AUTH_JWT_SECRET,
  },
  kafka: {
    serviceName: process.env.AUTH_KAFKA_SERVICE,
    clientId: process.env.AUTH_CLIENT_ID,
    brokers: process.env.AUTH_KAFKA_BROKERS.split(','),
  },
}));
