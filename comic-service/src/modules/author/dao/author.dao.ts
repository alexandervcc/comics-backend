import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthorModel } from '../model/author';

@Injectable()
export class AuthorDao {
  constructor(
    @InjectModel(AuthorModel.name)
    private readonly authorModel: Model<AuthorModel>,
  ) {}

  async getAuthorById(id: string) {
    return this.authorModel.findById(id).exec();
  }
}
