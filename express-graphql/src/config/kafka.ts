import { Kafka } from "kafkajs";

const kafkaConnection = new Kafka({
  clientId: "kafka-nodejs-starter",
  brokers: ["kafka1:9092"],
});

export default kafkaConnection;