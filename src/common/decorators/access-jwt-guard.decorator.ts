import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

export function AccessJwtGuard() {
  return applyDecorators(
    ApiBearerAuth('access-jwt'),
    UseGuards(AuthGuard('access-jwt')),
  );
}
