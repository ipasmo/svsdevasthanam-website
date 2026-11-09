import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PoojasService } from './poojas.service';

// Read-only for now; admin create/update/delete comes with the admin CMS work.
@ApiTags('poojas')
@Controller('poojas')
export class PoojasController {
  constructor(private readonly poojasService: PoojasService) {}

  @Get()
  findActive() { return this.poojasService.findActive(); }
}
