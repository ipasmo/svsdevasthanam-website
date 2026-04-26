import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GalleryService } from './gallery.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('gallery')
@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get()
  findAll(@Query('category') category?: string) { return this.galleryService.findAll(category); }

  @Get('categories')
  findCategories() { return this.galleryService.findCategories(); }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: any) { return this.galleryService.create(body); }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) { return this.galleryService.update(id, body); }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) { return this.galleryService.remove(id); }
}
