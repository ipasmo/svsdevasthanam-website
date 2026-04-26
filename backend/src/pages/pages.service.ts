import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PagesService {
  constructor(private prisma: PrismaService) {}

  findAll() { return this.prisma.page.findMany({ include: { translations: true }, orderBy: { updatedAt: 'desc' } }); }

  async findBySlug(slug: string, locale = 'en') {
    const page = await this.prisma.page.findUnique({
      where: { slug },
      include: { translations: { where: { locale } } },
    });
    if (!page || page.status !== 'ACTIVE') throw new NotFoundException(`Page '${slug}' not found`);
    return page;
  }

  create(data: any) { return this.prisma.page.create({ data }); }
  update(id: string, data: any) { return this.prisma.page.update({ where: { id }, data }); }
  remove(id: string) { return this.prisma.page.delete({ where: { id } }); }
}
