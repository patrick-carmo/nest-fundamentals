import { AuthService } from '../../auth/auth.service';
import { jwtServiceMock } from './jwt-service.mock';
import { accessToken } from './token.mock';

export const authServiceMock = {
  provide: AuthService,
  useValue: {
    createToken: jest.fn().mockReturnValue({ accessToken }),
    checkToken: jest.fn().mockReturnValue(jwtServiceMock),
    isValidToken: jest.fn().mockReturnValue(true),
    login: jest.fn().mockResolvedValue({ accessToken }),
    forget: jest.fn().mockReturnValue({ success: true }),
    reset: jest.fn().mockResolvedValue({ accessToken }),
    register: jest.fn().mockResolvedValue({ accessToken }),
  },
};
