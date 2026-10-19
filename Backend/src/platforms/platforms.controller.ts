import { Controller, Get, Param } from '@nestjs/common';
import { PlatformsService } from './platforms.service';
import { ApiOkResponse, ApiTags, ApiNotFoundResponse } from '@nestjs/swagger';
import { PlatformDto } from './dto/platform.dto';
import { ErrorResponseDto } from '../common/dto/error-response.dto';

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
  @ApiNotFoundResponse({
    description: 'No platform with this slug.',
    type: ErrorResponseDto,
  })
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.platformsService.findOne(slug);
  }
}
