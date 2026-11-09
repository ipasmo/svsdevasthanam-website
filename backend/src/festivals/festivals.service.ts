import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFestivalDto, UpdateFestivalDto } from './dto/festival.dto';

// Prisma needs a Date (a date-only string like "2027-04-15" is rejected).
// undefined = leave unchanged, null = clear the date.
function toDate(value: string | null | undefined): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  return new Date(value);
}

@Injectable()
export class FestivalsService {
  constructor(private prisma: PrismaService) {}

  findActive() {
    return this.prisma.festival.findMany({ where: { isActive: true }, orderBy: { orderIndex: 'asc' } });
  }

  findAll() {
    return this.prisma.festival.findMany({ orderBy: { orderIndex: 'asc' } });
  }

  async findBySlug(slug: string) {
    const festival = await this.prisma.festival.findUnique({ where: { slug } });
    if (!festival || !festival.isActive) throw new NotFoundException(`Festival '${slug}' not found`);
    return festival;
  }

  async create(dto: CreateFestivalDto) {
    await this.ensureSlugAvailable(dto.slug);
    return this.prisma.festival.create({ data: { ...dto, date: toDate(dto.date) } });
  }

  async update(id: string, dto: UpdateFestivalDto) {
    await this.findById(id);
    if (dto.slug) await this.ensureSlugAvailable(dto.slug, id);
    return this.prisma.festival.update({ where: { id }, data: { ...dto, date: toDate(dto.date) } });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.festival.delete({ where: { id } });
  }

  private async findById(id: string) {
    const festival = await this.prisma.festival.findUnique({ where: { id } });
    if (!festival) throw new NotFoundException(`Festival ${id} not found`);
    return festival;
  }

  private async ensureSlugAvailable(slug: string, exceptId?: string) {
    const existing = await this.prisma.festival.findUnique({ where: { slug } });
    if (existing && existing.id !== exceptId) throw new ConflictException(`Slug '${slug}' is already in use`);
  }
}
