import { Role } from '../../enums/role.enum';
import { CreateUserDTO } from '../../user/dto/create-user.dto';

export const createUserDTO: CreateUserDTO = {
  birthAt: '2000-01-01',
  email: 'ptemy5@gmail.com',
  name: 'Patrick do Carmo',
  password: 'Patrick@123',
  role: Role.User,
};
