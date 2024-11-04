import { ComicData } from '../model/Comic';

export class ComicDataDto implements ComicData {
  name: string;
  genre: string[];
  author: string[];
}
