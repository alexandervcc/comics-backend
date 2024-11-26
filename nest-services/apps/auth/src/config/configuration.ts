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
}));
