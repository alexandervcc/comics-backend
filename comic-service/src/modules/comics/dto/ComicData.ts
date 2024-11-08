import { ComicData } from '../model/comic';

export class ComicDataDto implements ComicData {
  name: string;
  genre: string[];
  author: string[];
}
