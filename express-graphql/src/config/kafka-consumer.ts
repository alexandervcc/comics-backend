import kafkaConnection from "./kafka";
import { Consumer } from "kafkajs";
import { Service } from "typedi";
import { KafkaTopics } from "../types/constants";

@Service()
class KafkaConsumer {
  private readonly consumer: Consumer;

  constructor() {
    this.consumer = kafkaConnection.consumer({
      groupId: "purchases-group",
    });
  }

  async consumeMessageFromBroker(topic: KafkaTopics) {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({
        topic,
        fromBeginning: true,
      });

      await this.consumer.run({
        eachMessage: async ({ message }) => {
          console.log(
            `Consumer received message: ${{
              key: message.key?.toString(),
              value: message.value?.toString(),
              headers: message.headers,
            }}`
          );
        },
      });
    } catch (error) {
      console.error("\n\n -> Error consuming message from Kafka: ", error);
    }
  }
}

export default KafkaConsumer;
