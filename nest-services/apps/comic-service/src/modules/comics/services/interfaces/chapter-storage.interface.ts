export type BufferFile = { filename: string; buffer: Buffer };

export interface ChapterStorageI {
  saveFiles(chapterDir: string, files: BufferFile[]): Promise<void>;

  getChapterDirectory(chapterId: string, subpath: string): string;

  getPagesFromStorage(chapterId: string, type: string): Promise<BufferFile[]>;
}
