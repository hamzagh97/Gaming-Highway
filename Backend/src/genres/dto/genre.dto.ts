import { ApiProperty } from '@nestjs/swagger';

export class GenreDto {
  @ApiProperty() slug: string;
  @ApiProperty() name: string;
  @ApiProperty() emoji: string;
}
