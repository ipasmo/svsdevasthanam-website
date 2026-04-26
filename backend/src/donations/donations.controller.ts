import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DonationsService } from './donations.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('donations')
@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post('order')
  createOrder(@Body() body: any) { return this.donationsService.createOrder(body); }

  @Post('verify')
  verifyPayment(@Body() body: any) { return this.donationsService.verifyPayment(body); }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.donationsService.findAll(+page, +limit);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('stats')
  getStats() { return this.donationsService.getStats(); }
}
