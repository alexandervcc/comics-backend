import "reflect-metadata";
import mongoose from "mongoose";
import { Service } from "typedi";
import { ENV } from "../env";

@Service()
class MongoDBConnection {
  constructor() {
    (async () => {
      try {
        await mongoose.connect(ENV.MONGO_URL);
        console.log("Connected to MongoDB");
      } catch (error) {
        console.error(`Error: ${error}`);
      }
    })();
  }
}

export default MongoDBConnection;
