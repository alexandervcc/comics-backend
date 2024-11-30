package acc.comic.emailer.services;

import java.io.UnsupportedEncodingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import acc.comic.emailer.dto.SendEmailRequestDto;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailSenderService {
  private JavaMailSender mailSender;

  public EmailSenderService() {
    this.mailSender = new JavaMailSenderImpl();
  }

  public void sendEmail(SendEmailRequestDto payload) {
    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message);

      helper.setFrom("alexandervcc@gmail.com.com", "Cheems Comics");
      helper.setTo(payload.email);
      helper.setSubject(payload.subject);
      helper.setText(payload.content, true);

      mailSender.send(message);
    } catch (Exception e) {
      System.out.println("Error: "+e.toString());
    }
  }
}
