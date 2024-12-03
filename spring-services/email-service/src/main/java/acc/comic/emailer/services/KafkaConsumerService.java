package acc.comic.emailer.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import acc.comic.emailer.dto.SendEmailRequestPayload;

@Service
public class KafkaConsumerService {
  private Logger logger = LoggerFactory.getLogger(KafkaConsumerService.class);

  @KafkaListener(topics = "#{@kafkaTopicBean}")
  public void listen(SendEmailRequestPayload message) {

    this.logger.info("Message received, sending email :", message);
  }
}
