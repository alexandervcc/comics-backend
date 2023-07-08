import kafkaConnection from "../config/kafka";
import { Producer } from "kafkajs";
import { Service } from "typedi";
import { KafkaTopics } from "../types/constants";

@Service()
class KafkaProducer {
  private readonly producer: Producer;
  constructor() {
    this.producer = kafkaConnection.producer({
      allowAutoTopicCreation: false,
      transactionTimeout: 30000,
    });
  }

  async sendMessageToBroke(
    topic: KafkaTopics,
    message: Record<string, unknown>
  ): Promise<boolean> {
    try {
      await this.producer.connect();

      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }],
      });

      await this.producer.disconnect();
    } catch (error) {
      return false;
    }
    return true;
  }
}

export default KafkaProducer;
