package acc.comic.emailer.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import acc.comic.emailer.dto.SendEmailRequestDto;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailSenderService {
  private Logger logger = LoggerFactory.getLogger(EmailSenderService.class);

  @Autowired
  private JavaMailSender mailSender;

  public EmailSenderService(JavaMailSender javaMailSender) {
  }

  public String sendEmail(SendEmailRequestDto payload) {
    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message);

      helper.setFrom("alexandervcc@gmail.com.com", "Cheems Comics");
      helper.setTo(payload.email);
      helper.setSubject(payload.subject);
      helper.setText(payload.content, true);

      mailSender.send(message);
      return "Email sent.";
    } catch (Exception e) {
      this.logger.error("Email was not able to be sent.", e);

    }
    return "Error sending email.";
  }
}
