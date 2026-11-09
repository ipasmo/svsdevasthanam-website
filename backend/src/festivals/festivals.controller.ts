import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { FestivalsService } from './festivals.service';
import { CreateFestivalDto, UpdateFestivalDto } from './dto/festival.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('festivals')
@Controller('festivals')
export class FestivalsController {
  constructor(private readonly festivalsService: FestivalsService) {}

  @Get()
  findActive() { return this.festivalsService.findActive(); }

  // Declared before ':slug' so "all" is not treated as a slug.
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_EDITOR)
  @Get('all')
  findAll() { return this.festivalsService.findAll(); }

  @Get(':slug')
  findOne(@Param('slug') slug: string) { return this.festivalsService.findBySlug(slug); }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_EDITOR)
  @Post()
  create(@Body() dto: CreateFestivalDto) { return this.festivalsService.create(dto); }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_EDITOR)
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateFestivalDto) {
    return this.festivalsService.update(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_EDITOR)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) { return this.festivalsService.remove(id); }
}
