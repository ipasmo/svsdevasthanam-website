import { Module } from '@nestjs/common';
import { FestivalsService } from './festivals.service';
import { FestivalsController } from './festivals.controller';

@Module({ providers: [FestivalsService], controllers: [FestivalsController] })
export class FestivalsModule {}
