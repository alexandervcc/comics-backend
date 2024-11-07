import { Controller } from '@nestjs/common';
import { AuthorService } from '../services/author.service';

@Controller('api/v1/author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}
}
