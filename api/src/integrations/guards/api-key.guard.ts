import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    const validKey = this.configService.get<string>('SYNC_API_KEY');

    if (!apiKey || apiKey !== validKey) {
      throw new UnauthorizedException('Yanlış və ya çatışmayan API açarı!');
    }

    return true;
  }
}
