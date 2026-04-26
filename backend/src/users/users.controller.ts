import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN' as any)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() { return this.usersService.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.usersService.findOne(id); }

  @Post()
  create(@Body() body: any) { return this.usersService.create(body); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) { return this.usersService.update(id, body); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.usersService.remove(id); }
}
