import { Role } from '../../enums/role.enum';
import { User } from '../../user/entity/user.entity';

export const userEntityList: User[] = [
  {
    id: 1,
    email: 'ptemy5@gmail.com',
    name: 'Patrick',
    password: '$2b$10$WFRnDJ7gtyYTNNXEI4Y95O3CEFuzYhh9BCbXo8JqPt0wiVx420lVy',
    birthAt: null,
    role: 2,
    createdAt: new Date('2024-06-05T00:57:42.150Z'),
    updatedAt: new Date('2024-06-05T00:57:42.150Z'),
  },
  {
    birthAt: new Date('2000-01-01'),
    email: 'patrickdocarmo7@gmail.com',
    name: 'Patrick',
    password: 'Patrick@123',
    role: Role.User,
  },
];
