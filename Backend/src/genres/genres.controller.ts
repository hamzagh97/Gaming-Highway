import { Controller, Get } from '@nestjs/common';
import { GenresService } from './genres.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GenreDto } from './dto/genre.dto';

@ApiTags('genres')
@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}
  @ApiOkResponse({ type: [GenreDto] })
  @Get()
  findAll() {
    return this.genresService.findAll();
  }
}
