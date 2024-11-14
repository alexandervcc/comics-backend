import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChapterModel } from '../model/chapter';
import { CreateChapterDto } from '../dto/ChapterDto';

@Injectable()
export class ChapterDao {
  constructor(
    @InjectModel(ChapterModel.name)
    private readonly comicModel: Model<ChapterModel>,
  ) {}

  async createChapter(comic: CreateChapterDto) {
    const newComic = new this.comicModel(comic);
    return newComic.save();
  }
}
