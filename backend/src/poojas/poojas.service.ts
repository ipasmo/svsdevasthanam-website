import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PoojasService {
  constructor(private prisma: PrismaService) {}

  findActive() {
    return this.prisma.pooja.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } });
  }
}
