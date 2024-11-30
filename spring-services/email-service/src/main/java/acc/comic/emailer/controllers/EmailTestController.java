package acc.comic.emailer.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import acc.comic.emailer.dto.SendEmailRequestDto;
import acc.comic.emailer.services.EmailSenderService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

// TODO: expose just for testing, need to be removed once Kafka is added
@Controller()
@RequestMapping(path = "/api/v1/email")
public class EmailTestController {
  @Autowired
  private EmailSenderService emailSenderService;

  @PostMapping("/send")
  public ResponseEntity<String> postMethodName(@RequestBody SendEmailRequestDto data) {
    this.emailSenderService.sendEmail(data);
    return ResponseEntity.ok().body("Email sent");
  }

}
