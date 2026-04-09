import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from '../../users/entities/user.entity';
import { ErrorMessages } from '../../common/constants/error-messages';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException(ErrorMessages.FORBIDDEN_RESOURCE);
    }

    // Admin passes everything
    if (user.userType === UserType.ADMIN) {
      return true;
    }

    // Only Employees have specific roles/permissions to check
    if (user.userType === UserType.EMPLOYEE) {
      // payload might not contain the full role object depending on what we put in JWT
      // Ideally, the JWT JWT strategy should fetch the user with their role and permissions.
      // Assuming user.role.permissions is populated:
      if (!user.role || !user.role.permissions) {
        throw new ForbiddenException(ErrorMessages.FORBIDDEN_RESOURCE);
      }

      const hasPermission = requiredPermissions.some((permission) =>
        user.role.permissions.includes(permission),
      );

      if (!hasPermission) {
        throw new ForbiddenException(ErrorMessages.FORBIDDEN_RESOURCE);
      }

      return true;
    }

    // Customers or other types do not have permissions
    throw new ForbiddenException(ErrorMessages.FORBIDDEN_RESOURCE);
  }
}
