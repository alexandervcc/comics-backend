import { config } from "dotenv";

config();

export const ENV = {
  ENVIRONMENT: process.env.ENVIRONMENT || "local",
  PORT: process.env.SERVER_PORT || 3000,
  MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017",
  JWT_SECRET: process.env.JWT_SECRET || "",
  REDIS_PASS: process.env.REDIS_PASS || "",
};
