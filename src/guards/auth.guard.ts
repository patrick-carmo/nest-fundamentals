import { UserService } from 'src/user/user.service';
import { AuthService } from '../auth/auth.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;

    try {
      const data = this.authService.checkToken(
        (authorization ?? '').split(' ')[1],
      );

      request.user = await this.userService.show(data.id);

      request.tokenPayload = data;

      return true;
    } catch (e) {
      return false;
    }
  }
}
