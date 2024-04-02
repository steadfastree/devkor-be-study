import { HttpCode, applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';

export function CreatedResponse(message: string = 'Created Response') {
  return applyDecorators(
    ApiCreatedResponse({ description: message }),
    HttpCode(201),
  );
}
