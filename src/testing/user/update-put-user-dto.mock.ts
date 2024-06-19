import { UpdatePutUserDTO } from '../../user/dto/update-put-user.dto';
import { Role } from '../../enums/role.enum';

export const updatePutUserDTO: UpdatePutUserDTO = {
  birthAt: '2000-01-01',
  email: 'ptemy5@gmail.com',
  name: 'Patrick do Carmo',
  password: 'Patrick@123',
  role: Role.User,
};
