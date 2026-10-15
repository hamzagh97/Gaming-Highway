import { Module } from '@nestjs/common';
import { PlatformsService } from './platforms.service';
import { PlatformsController } from './platforms.controller';
import { GenresService } from '../genres/genres.service';
import { GenresController } from '../genres/genres.controller';

@Module({
  controllers: [PlatformsController],
  providers: [PlatformsService],
})
export class PlatformsModule {}
