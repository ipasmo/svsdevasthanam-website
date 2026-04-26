import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VideosService {
  constructor(private prisma: PrismaService) {}

  findAll() { return this.prisma.video.findMany({ where: { isActive: true }, orderBy: { publishedAt: 'desc' } }); }
  findLive() { return this.prisma.video.findFirst({ where: { isActive: true, isLive: true } }); }
  create(data: any) { return this.prisma.video.create({ data }); }
  update(id: string, data: any) { return this.prisma.video.update({ where: { id }, data }); }
  remove(id: string) { return this.prisma.video.delete({ where: { id } }); }
}
