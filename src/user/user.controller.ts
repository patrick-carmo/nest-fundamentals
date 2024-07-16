import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto copy';
import { UserService } from './user.service';
import { ParamId } from '../decorators/param-id.decorator';
import { Roles } from '../decorators/role.decorator';
import { Role } from '../enums/role.enum';
import { RoleGuard } from '../guards/role.guard';
import { AuthGuard } from '../guards/auth.guard';
import { Throttle } from '@nestjs/throttler';

@UseGuards(AuthGuard, RoleGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() body: CreateUserDTO) {
    return this.userService.create(body);
  }

  @Roles(Role.Admin)
  @Get()
  async list() {
    return this.userService.list();
  }

  @Throttle({ default: { limit: 3, ttl: 6000 } })
  // @SkipThrottle()
  @Roles(Role.Admin)
  @Get(':id')
  async show(@ParamId() id: number) {
    return this.userService.show(id);
  }

  @Roles(Role.Admin)
  @Put(':id')
  async update(@ParamId() id: number, @Body() body: UpdatePutUserDTO) {
    return this.userService.update(id, body);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async updatePartial(@ParamId() id: number, @Body() body: UpdatePatchUserDTO) {
    return this.userService.updatePartial(id, body);
  }

  @Delete(':id')
  async delete(@ParamId() id: number) {
    return {
      success: await this.userService.delete(id),
    };
  }
}
