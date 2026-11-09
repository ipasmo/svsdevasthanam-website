import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// Liveness only: it deliberately does not query the database. Render polls this
// every few seconds, and a DB ping would keep Neon's compute from ever suspending.
@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok' };
  }
}
