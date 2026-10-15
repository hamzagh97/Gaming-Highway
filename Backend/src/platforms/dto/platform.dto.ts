import { ApiProperty } from '@nestjs/swagger';

export class PlatformDto {
  @ApiProperty() slug: string;
  @ApiProperty() name: string;
  @ApiProperty() shortName: string;
  @ApiProperty() emoji: string;
  @ApiProperty() hue: number;
}
