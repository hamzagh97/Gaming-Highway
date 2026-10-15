import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok' };
  }

  //test
  // @Get('boom')
  // boom() {
  //   throw new Error('secret database password');
  // }
}
