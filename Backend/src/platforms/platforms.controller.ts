import { Controller, Get, Param } from '@nestjs/common';
import { PlatformsService } from './platforms.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PlatformDto } from './dto/platform.dto';

@ApiTags('platforms')
@Controller('platforms')
export class PlatformsController {
  constructor(private readonly platformsService: PlatformsService) {}

  @ApiOkResponse({ type: [PlatformDto] })
  @Get()
  findAll() {
    return this.platformsService.findAll();
  }

  @ApiOkResponse({ type: PlatformDto })
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.platformsService.findOne(slug);
  }
}
