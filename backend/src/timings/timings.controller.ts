import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TimingsService } from './timings.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('timings')
@Controller('timings')
export class TimingsController {
  constructor(private readonly timingsService: TimingsService) {}

  @Get()
  findAll() { return this.timingsService.findAll(); }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: any) { return this.timingsService.create(body); }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) { return this.timingsService.update(id, body); }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) { return this.timingsService.remove(id); }
}
