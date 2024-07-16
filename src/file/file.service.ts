import { Injectable } from '@nestjs/common';
import { PathLike } from 'fs';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class FileService {
  async getDestinationPath() {
    await mkdir(join(__dirname, '..', '..', 'storage', 'photos'), {
      recursive: true,
    });
    return join(__dirname, '..', '..', 'storage', 'photos');
  }

  async uploadFile(filename: string, file: Express.Multer.File) {
    const path: PathLike = join(await this.getDestinationPath(), filename);
    await writeFile(path, file.buffer);
    return path;
  }
}
