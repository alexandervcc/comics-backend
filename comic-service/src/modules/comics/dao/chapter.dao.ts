import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, mongo } from 'mongoose';
import { ChapterModel } from '../model/chapter';
import { CreateChapterDto } from '../dto/chapter.dto';

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

  async getChapterById(id: string) {
    return this.comicModel.findById(new mongo.ObjectId(id));
  }
}
