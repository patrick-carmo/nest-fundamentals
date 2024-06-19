import { Role } from '../../enums/role.enum';
import { User } from '../../user/entity/user.entity';

export const userEntityList: User[] = [
  {
    birthAt: new Date('2000-01-01'),
    email: 'ptemy5@gmail.com',
    name: 'Patrick do Carmo',
    password: 'Patrick@123',
    role: Role.Admin,
  },
  {
    birthAt: new Date('2000-01-01'),
    email: 'patrickdocarmo7@gmail.com',
    name: 'Patrick',
    password: 'Patrick@123',
    role: Role.User,
  },
];
