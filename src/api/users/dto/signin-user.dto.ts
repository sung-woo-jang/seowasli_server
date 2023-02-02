import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class SignInRequestDto extends PickType(User, [
  'account',
  'password',
] as const) {}