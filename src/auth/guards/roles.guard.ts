import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userRole = user?.rol?.nombre?.toString()?.trim();

    if (!userRole) {
      throw new ForbiddenException('No se pudo determinar el rol del usuario');
    }

    const matchesRole = requiredRoles.some(
      (role) => role.toLowerCase() === userRole.toLowerCase(),
    );

    if (!matchesRole) {
      throw new ForbiddenException('Acceso denegado para tu rol');
    }

    return true;
  }
}
