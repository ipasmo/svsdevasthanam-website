import { Module } from '@nestjs/common';
import { DeitiesService } from './deities.service';
import { DeitiesController } from './deities.controller';

@Module({ providers: [DeitiesService], controllers: [DeitiesController] })
export class DeitiesModule {}
