import { Injectable, Logger } from '@nestjs/common';
import { AuthorDao } from '../dao/author.dao';
import { AuthorData } from '../model/author';

@Injectable()
export class AuthorService {
  private logger = new Logger(AuthorService.name);

  constructor(private readonly authorDao: AuthorDao) {}

  async getAuthorById(id: string): Promise<AuthorData | null> {
    const author = await this.authorDao.getAuthorById(id);
    if (author == null) {
      this.logger.log('There is no author for the provided id.', { id });
      return null;
    }
    return author;
  }
}
