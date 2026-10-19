import { ApiProperty } from '@nestjs/swagger';

/** The error body every endpoint returns (built by AllExceptionsFilter). */
export class ErrorResponseDto {
  @ApiProperty({ example: 404 })
  statusCode: number;

  @ApiProperty({ example: '2026-10-17T10:00:00.000Z' })
  timestamp: string;

  @ApiProperty({ example: '/api/v1/platforms/nope' })
  path: string;

  @ApiProperty({
    description: 'A sentence, or a list of sentences for validation errors.',
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    example: 'Platform "nope" not found',
  })
  message: string | string[];

  @ApiProperty({ example: 'NotFoundException' })
  error: string;
}
