import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  findAll() { return this.prisma.event.findMany({ where: { isActive: true }, orderBy: { startDate: 'asc' } }); }
  findUpcoming() { return this.prisma.event.findMany({ where: { isActive: true, startDate: { gte: new Date() } }, orderBy: { startDate: 'asc' }, take: 10 }); }
  create(data: any) { return this.prisma.event.create({ data }); }
  update(id: string, data: any) { return this.prisma.event.update({ where: { id }, data }); }
  remove(id: string) { return this.prisma.event.delete({ where: { id } }); }
}
