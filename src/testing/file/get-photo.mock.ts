import { getFileToBuffer } from './get-file-to-buffer';
import { join } from 'path';

export const getPhoto = async () => {
  const { buffer, stream } = await getFileToBuffer(
    join(__dirname, 'photo.jpg'),
  );

  const photo: Express.Multer.File = {
    fieldname: 'file',
    originalname: 'photo.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    size: 1024 * 50,
    stream,
    destination: '',
    filename: 'file-name',
    path: 'file-path',
    buffer,
  };

  return photo;
};
