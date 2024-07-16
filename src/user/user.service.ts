import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto copy';
import { genSalt, hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(data: CreateUserDTO) {
    const userExists = await this.usersRepository.exists({
      where: { email: data.email },
    });

    if (userExists) throw new BadRequestException('Este email já está em uso.');

    const salt = await genSalt(10);
    data.password = await hash(data.password, salt);

    const user = this.usersRepository.create(data);

    return this.usersRepository.save(user);
  }

  async list() {
    return this.usersRepository.find();
  }

  async show(id: number) {
    await this.exists(id);

    return this.usersRepository.findOneBy({ id });
  }

  async update(
    id: number,
    { email, name, password, birthAt, role }: UpdatePutUserDTO,
  ) {
    await this.exists(id);

    await this.usersRepository.update(id, {
      email,
      name,
      password: await hash(password, await genSalt()),
      birthAt: birthAt ? new Date(birthAt) : null,
      role,
    });

    return this.show(id);
  }

  async updatePartial(
    id: number,
    { email, name, password, birthAt, role }: Partial<UpdatePatchUserDTO>,
  ) {
    await this.exists(id);

    const data: any = {};
    if (birthAt) data.birthAt = new Date(birthAt);
    if (email) data.email = email;
    if (name) data.name = name;
    if (password) data.password = await hash(password, await genSalt());
    if (role) data.role = role;

    await this.usersRepository.update(id, data);

    return this.show(id);
  }

  async delete(id: number) {
    await this.exists(id);
    await this.usersRepository.delete(id);
    return true;
  }

  async exists(id: number) {
    const user = await this.usersRepository.exists({ where: { id } });

    if (!user) throw new NotFoundException(`Usuário ${id} não encontrado.`);
  }
}
