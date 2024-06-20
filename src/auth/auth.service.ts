import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UserService } from '../user/user.service';
import { compare, hash, genSalt } from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../user/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private readonly issuer = 'login';
  private readonly audience = 'users';

  constructor(
    private readonly JWTService: JwtService,
    private readonly userService: UserService,
    private readonly mailer: MailerService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  createToken(user: User) {
    return {
      accessToken: this.JWTService.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        {
          expiresIn: '7d',
          subject: user.id.toString(),
          issuer: this.issuer,
          audience: this.audience,
        },
      ),
    };
  }

  checkToken(token: string) {
    try {
      return this.JWTService.verify(token, {
        issuer: this.issuer,
        audience: this.audience,
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  isValidToken(token: string) {
    try {
      this.checkToken(token);
      return true;
    } catch (e) {
      return false;
    }
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException('Email e/ou senha inválidos');
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Email e/ou senha inválidos');
    }

    return this.createToken(user);
  }

  async register(data: AuthRegisterDTO) {
    delete data.role;

    const user = await this.userService.create(data);

    return this.createToken(user);
  }

  async forget(email: string) {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException('E-mail incorreto');
    }
    const token = this.JWTService.sign(
      {
        id: user.id,
      },
      {
        expiresIn: '30 minutes',
        subject: String(user.id),
        issuer: 'forget',
        audience: 'users',
      },
    );

    await this.mailer.sendMail({
      subject: 'Recuperação de senha',
      to: email,
      template: 'forget',
      context: {
        name: user.name,
        token,
      },
    });
    return true;
  }
  async reset(password: string, token: string) {
    try {
      const data = this.JWTService.verify(token, {
        issuer: 'forget',
        audience: 'users',
      }) as { id: number };

      const { id } = data;

      const salt = await genSalt();
      password = await hash(password, salt);

      await this.userRepository.update(id, { password });

      const user = await this.userService.show(id);

      return this.createToken(user);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
