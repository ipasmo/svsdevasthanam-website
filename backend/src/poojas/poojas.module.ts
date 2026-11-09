import { Module } from '@nestjs/common';
import { PoojasService } from './poojas.service';
import { PoojasController } from './poojas.controller';

@Module({ providers: [PoojasService], controllers: [PoojasController] })
export class PoojasModule {}
