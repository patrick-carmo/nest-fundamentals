import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Role } from 'src/enums/role.enum';

export class CreateUserDTO {
  @IsString({
    message: 'Nome inválido.',
  })
  name: string;

  @IsEmail({}, { message: 'Email inválido.' })
  email: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message: 'Senha fraca, troque por uma senha mais forte.',
    },
  )
  password: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de nascimento inválida.' })
  birthAt?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: number;
}
