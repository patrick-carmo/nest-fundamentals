import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { userRepositoryMock } from '../testing/user/user-repository.mock';
import { jwtServiceMock } from '../testing/auth/jwt-service.mock';
import { userServiceMock } from '../testing/auth/user-service.mock';
import { mailerServiceMock } from '../testing/auth/mailer-service.mock';
import { userEntityList } from '../testing/user/user-entity-list.mock';
import { accessToken } from '../testing/auth/token.mock';
import { jwtPayload } from '../testing/auth/jwt-payload.mock';
import { resetToken } from '../testing/auth/reset-token.mock';
import { authRegisterDTO } from '../testing/auth/auth-register-dto.mock';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        userRepositoryMock,
        jwtServiceMock,
        userServiceMock,
        mailerServiceMock,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  test('Validar a definição', () => {
    expect(authService).toBeDefined();
  });

  describe('token', () => {
    test('createToken method', () => {
      const result = authService.createToken(userEntityList[0]);

      expect(result).toEqual({
        accessToken,
      });
    });

    test('checkToken method', () => {
      const result = authService.checkToken(accessToken);

      expect(result).toEqual(jwtPayload);
    });

    test('checkToken method', () => {
      const result = authService.isValidToken(accessToken);

      expect(result).toEqual(true);
    });
  });
  describe('Autenticação', () => {
    test('login method', async () => {
      const result = await authService.login('ptemy5@gmail.com', 'Patrick@123');

      expect(result).toEqual({ accessToken });
    });

    test('forget method', async () => {
      const result = await authService.forget('ptemy5@gmail.com');

      expect(result).toEqual(true);
    });

    test('reset method', async () => {
      const result = await authService.reset('ptemy5@gmail.com', resetToken);

      expect(result).toEqual({ accessToken });
    });

    test('register method', async () => {
      const result = await authService.register(authRegisterDTO);

      expect(result).toEqual({ accessToken });
    });
  });
});
