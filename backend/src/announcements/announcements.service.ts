import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnnouncementsService {
  constructor(private prisma: PrismaService) {}

  findActive() {
    return this.prisma.announcement.findMany({
      where: { isActive: true, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
      orderBy: [{ isImportant: 'desc' }, { createdAt: 'desc' }],
    });
  }
  findAll() { return this.prisma.announcement.findMany({ orderBy: { createdAt: 'desc' } }); }
  create(data: any) { return this.prisma.announcement.create({ data }); }
  update(id: string, data: any) { return this.prisma.announcement.update({ where: { id }, data }); }
  remove(id: string) { return this.prisma.announcement.delete({ where: { id } }); }
}
