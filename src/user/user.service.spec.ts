import { userRepositoryMock } from '../testing/user/user-repository.mock';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { userEntityList } from '../testing/user/user-entity-list.mock';
import { createUserDTO } from '../testing/user/create-user-dto.mock';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { updatePutUserDTO } from '../testing/user/update-put-user-dto.mock';
import { updatePatchUserDTO } from '../testing/user/update-patch-user-dto.mock';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, userRepositoryMock],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
  });

  test('Validar a definição', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('Create', () => {
    test('method create', async () => {
      jest.spyOn(userRepository, 'exists').mockResolvedValueOnce(false);

      const result = await userService.create(createUserDTO);

      expect(result).toEqual(userEntityList[0]);
    });
  });

  describe('Read', () => {
    test('method list', async () => {
      const result = await userService.list();

      expect(result).toEqual(userEntityList);
    });

    test('method show', async () => {
      const result = await userService.show(0);

      expect(result).toEqual(userEntityList[0]);
    });
  });

  describe('Update', () => {
    test('method update', async () => {
      const result = await userService.update(0, updatePutUserDTO);

      expect(result).toEqual(userEntityList[0]);
    });

    test('method updatePartial', async () => {
      const result = await userService.updatePartial(0, updatePatchUserDTO);

      expect(result).toEqual(userEntityList[0]);
    });
  });

  describe('Delete', () => {
    test('method delete', async () => {
      const result = await userService.delete(0);

      expect(result).toEqual(true);
    });
  });
});
