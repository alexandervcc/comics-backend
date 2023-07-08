require("dotenv").config();

export const ENV = {
  ENVIRONMENT: process.env.ENVIRONMENT || "local",
  PORT: process.env.SERVER_PORT || 3000,
  MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017",
  SECRET: process.env.SECRET || "",
};
