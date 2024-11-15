import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
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

  async getChapterByComicAndEpisode(comic: ObjectId, episode: number) {
    return this.comicModel.findOne({ comic, episode });
  }
}
