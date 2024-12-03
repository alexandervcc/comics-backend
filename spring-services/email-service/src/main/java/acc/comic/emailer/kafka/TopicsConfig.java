package acc.comic.emailer.kafka;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TopicsConfig {
  @Bean
  String kafkaTopicBean(@Value("${spring.kafka.topics}") String topics) {
    return topics;
  }
}
