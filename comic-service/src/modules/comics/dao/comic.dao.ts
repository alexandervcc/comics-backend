import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ComicModel } from '../model/comic';
import { Model } from 'mongoose';
import { ComicDataDto } from '../dto/ComicData';

@Injectable()
export class ComicDao {
  constructor(
    @InjectModel(ComicModel.name)
    private readonly comicModel: Model<ComicModel>,
  ) {}

  async createComic(comic: ComicDataDto) {
    const newComic = new this.comicModel(comic);
    return newComic.save();
  }

  async getComic(id: string) {
    return this.comicModel.findById(id).exec();
  }

  async updateComic(_id: string, data: ComicDataDto) {
    return this.comicModel
      .findOneAndUpdate({ _id }, { $set: { ...data } }, { new: true })
      .exec();
  }
}
