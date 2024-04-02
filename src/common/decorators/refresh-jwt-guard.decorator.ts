import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

export function RefreshJwtGuard() {
  return applyDecorators(
    ApiBearerAuth('refresh-jwt'),
    UseGuards(AuthGuard('refresh-jwt')),
  );
}
