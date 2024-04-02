import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function GetPostsListQuery() {
  return applyDecorators(
    ApiQuery({ name: 'page', required: false, description: '페이지' }),
    ApiQuery({ name: 'keyword', required: false, description: '검색 키워드' }),
    ApiQuery({
      name: 'orderType',
      required: false,
      description: '정렬 타입 : createdAt(default)/likeCount/viewCount',
    }),
    ApiQuery({
      name: 'order',
      required: false,
      description: 'ASC/DESC(default)',
    }),
  );
}
