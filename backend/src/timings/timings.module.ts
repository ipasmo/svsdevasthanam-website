import { Module } from '@nestjs/common';
import { TimingsService } from './timings.service';
import { TimingsController } from './timings.controller';

@Module({ providers: [TimingsService], controllers: [TimingsController] })
export class TimingsModule {}
