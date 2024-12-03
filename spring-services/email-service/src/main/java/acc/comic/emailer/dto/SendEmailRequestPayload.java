package acc.comic.emailer.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
public class SendEmailRequestPayload {
  public String email;

  public String subject;

  public String content;
}
