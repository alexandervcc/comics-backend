import "reflect-metadata";
import { startServer } from "./app";
import { Container } from "typedi";
import MongoDBConnection from "./config/mongo";
import { ENV } from "./env";

const main = async () => {
  //Start db connection
  Container.get(MongoDBConnection);

  const app = await startServer();

  app.listen(ENV.PORT);
  console.log("Server running on: ", ENV.PORT);
};

main();
