import { FileService } from '../../file/file.service';
import { userEntityList } from '../user/user-entity-list.mock';

export const fileServiceMock = {
  provide: FileService,
  useValue: {
    upload: jest.fn().mockResolvedValue(userEntityList[0]),
    getDestinationPath: jest.fn().mockReturnValue(''),
  },
};
