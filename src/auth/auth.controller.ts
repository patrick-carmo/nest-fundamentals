import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthForgetDTO } from './dto/auth-forget.dto';
import { AuthResetDTO } from './dto/auth-reset.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { FileService } from '../file/file.service';
import { UserEntity } from '../user/entity/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly fileService: FileService,
  ) {}

  @Post('login')
  async login(@Body() { email, password }: AuthLoginDTO) {
    return this.authService.login(email, password);
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDTO) {
    return this.authService.register(body);
  }

  @Post('forget')
  async forget(@Body() { email }: AuthForgetDTO) {
    return this.authService.forget(email);
  }

  @Post('reset')
  async reset(@Body() { password, token }: AuthResetDTO) {
    return this.authService.reset(password, token);
  }

  @UseGuards(AuthGuard)
  @Post('me')
  async me(@User() user: UserEntity) {
    return user;
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @Post('photo')
  async uploadPhoto(
    @User() user,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image/jpeg' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 }),
        ],
      }),
    )
    photo: Express.Multer.File,
  ) {
    const filename = `photo-${user.id}.jpg`;

    try {
      await this.fileService.uploadFile(filename, photo);
    } catch (e) {
      throw new BadRequestException(e);
    }

    return { photo };
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photos', maxCount: 5 },
      { name: 'documents', maxCount: 2 },
    ]),
  )
  @UseGuards(AuthGuard)
  @Post('files')
  async uploadFilesFields(
    @User() user,
    @UploadedFiles()
    files: { photos: Express.Multer.File[]; documents: Express.Multer.File[] },
  ) {
    try {
      const path = (type?: string) => {
        return join(
          process.env.PATH_DATA,
          'files',
          `user-${user.id}`,
          type ?? '',
        );
      };

      await mkdir(path(), {
        recursive: true,
      });

      for (const photo of files.photos) {
        await this.fileService.uploadFile(path(photo.originalname), photo);
      }

      for (const document of files.documents) {
        await this.fileService.uploadFile(
          path(document.originalname),
          document,
        );
      }

      return { sucess: true };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
