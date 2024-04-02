import { HttpCode, applyDecorators } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

export function OkResponse(message: string = 'Successful Response') {
  return applyDecorators(
    ApiOkResponse({
      description: message,
    }),
    HttpCode(200),
  );
}
