import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto copy';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ email, name, password }: CreateUserDTO) {
    return this.prisma.user.create({
      data: {
        email,
        name,
        password: await hash(password, 10),
      },
    });
  }

  async list() {
    return this.prisma.user.findMany();
  }

  async show(id: number) {
    await this.exists(id);

    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async update(
    id: number,
    { email, name, password, birthAt, role }: UpdatePutUserDTO,
  ) {
    await this.exists(id);

    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        email,
        name,
        password: await hash(password, 10),
        birthAt: birthAt ? new Date(birthAt) : null,
        role,
      },
    });
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
    if (password) data.password = await hash(password, 10);
    if (role) data.role = role;

    return this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: number) {
    await this.exists(id);

    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async exists(id: number) {
    const user = await this.prisma.user.count({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuário ${id} não encontrado.`);
    }
  }
}
