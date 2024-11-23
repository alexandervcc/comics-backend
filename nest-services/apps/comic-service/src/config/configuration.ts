import { registerAs } from '@nestjs/config';

export interface Configuration {
  port: number;
  redis: {
    pass: string;
    host: string;
    port: number;
  };
  kafka: {
    broker: string;
  };
  mongo: {
    uri: string;
  };
}

export const configuration = registerAs('configuration', () => ({
  port: parseInt(process.env.COMICS_PORT),
  redis: {
    pass: process.env.REDIS_PASS,
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
  },
  kafka: {
    broker: process.env.KAFKA_BROKER,
  },
  mongo: {
    uri: process.env.COMICS_MONGO_URI,
    db: process.env.COMICS_DB,
  },
}));
