import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DeitiesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.deity.findMany({ where: { isActive: true }, orderBy: { orderIndex: 'asc' } });
  }

  async findBySlug(slug: string) {
    const deity = await this.prisma.deity.findUnique({ where: { slug } });
    if (!deity) throw new NotFoundException(`Deity '${slug}' not found`);
    return deity;
  }

  create(data: any) { return this.prisma.deity.create({ data }); }

  async update(id: string, data: any) {
    await this.prisma.deity.findUniqueOrThrow({ where: { id } });
    return this.prisma.deity.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.prisma.deity.findUniqueOrThrow({ where: { id } });
    return this.prisma.deity.delete({ where: { id } });
  }
}
