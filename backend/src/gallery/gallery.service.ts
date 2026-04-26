import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GalleryService {
  constructor(private prisma: PrismaService) {}

  findAll(categorySlug?: string) {
    return this.prisma.galleryImage.findMany({
      where: {
        isActive: true,
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      },
      include: { category: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  create(data: any) { return this.prisma.galleryImage.create({ data }); }

  update(id: string, data: any) { return this.prisma.galleryImage.update({ where: { id }, data }); }

  remove(id: string) { return this.prisma.galleryImage.delete({ where: { id } }); }

  findCategories() { return this.prisma.galleryCategory.findMany(); }
}
