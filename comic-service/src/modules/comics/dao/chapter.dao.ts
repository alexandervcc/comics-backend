import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChapterModel } from '../model/chapter';

@Injectable()
export class ChapterDao {
  constructor(
    @InjectModel(ChapterModel.name)
    private readonly comicModel: Model<ChapterModel>,
  ) {}
}
