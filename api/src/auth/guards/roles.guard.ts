import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from '../../users/entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { ErrorMessages } from '../../common/constants/error-messages';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    if (!user || !requiredRoles.some((role) => user.userType === role)) {
      throw new ForbiddenException(ErrorMessages.FORBIDDEN_RESOURCE);
    }
    return true;
  }
}
