import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const http = context.switchToHttp();
    const req: Request = http.getRequest();
    if (req.path.startsWith('/user/login')) return true;
    const session = req.session as unknown as { userId: number; role: number };
    if (!session.userId)
      throw new HttpException('暂无权限！', HttpStatus.UNAUTHORIZED);

    return true;
  }
}
