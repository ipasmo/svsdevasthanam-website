import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DeitiesService } from './deities.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('deities')
@Controller('deities')
export class DeitiesController {
  constructor(private readonly deitiesService: DeitiesService) {}

  @Get()
  findAll() { return this.deitiesService.findAll(); }

  @Get(':slug')
  findOne(@Param('slug') slug: string) { return this.deitiesService.findBySlug(slug); }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: any) { return this.deitiesService.create(body); }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) { return this.deitiesService.update(id, body); }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) { return this.deitiesService.remove(id); }
}
