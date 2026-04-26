import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TimingsService {
  constructor(private prisma: PrismaService) {}

  findAll() { return this.prisma.templeTiming.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }); }
  create(data: any) { return this.prisma.templeTiming.create({ data }); }
  update(id: string, data: any) { return this.prisma.templeTiming.update({ where: { id }, data }); }
  remove(id: string) { return this.prisma.templeTiming.delete({ where: { id } }); }
}
