import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DeitiesService } from './deities.service';
import { PrismaService } from '../prisma/prisma.service';

const mockDeity = {
  id: 'deity-1',
  nameEn: 'Sri Venkateshwara Swamy',
  nameTe: null as string | null,
  nameHi: null as string | null,
  slug: 'venkateshwara',
  descriptionEn: 'Lord of Seven Hills',
  descriptionTe: null as string | null,
  descriptionHi: null as string | null,
  significance: null as string | null,
  imageUrl: null as string | null,
  isActive: true,
  orderIndex: 1,
  rituals: null as unknown,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

const mockPrisma = {
  deity: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('DeitiesService', () => {
  let service: DeitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeitiesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<DeitiesService>(DeitiesService);
  });

  afterEach(() => jest.clearAllMocks());

  // ── findAll ────────────────────────────────────────────────────────────────
  describe('findAll', () => {
    it('returns active deities ordered by orderIndex', async () => {
      const deities = [mockDeity];
      mockPrisma.deity.findMany.mockResolvedValue(deities);

      const result = await service.findAll();

      expect(mockPrisma.deity.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { orderIndex: 'asc' },
      });
      expect(result).toEqual(deities);
    });

    it('returns empty array when no active deities', async () => {
      mockPrisma.deity.findMany.mockResolvedValue([]);
      expect(await service.findAll()).toEqual([]);
    });
  });

  // ── findBySlug ─────────────────────────────────────────────────────────────
  describe('findBySlug', () => {
    it('returns the deity matching the slug', async () => {
      mockPrisma.deity.findUnique.mockResolvedValue(mockDeity);

      const result = await service.findBySlug('venkateshwara');

      expect(mockPrisma.deity.findUnique).toHaveBeenCalledWith({
        where: { slug: 'venkateshwara' },
      });
      expect(result).toEqual(mockDeity);
    });

    it('throws NotFoundException when slug not found', async () => {
      mockPrisma.deity.findUnique.mockResolvedValue(null);

      await expect(service.findBySlug('unknown')).rejects.toThrow(NotFoundException);
      await expect(service.findBySlug('unknown')).rejects.toThrow("Deity 'unknown' not found");
    });
  });

  // ── create ─────────────────────────────────────────────────────────────────
  describe('create', () => {
    it('creates and returns a deity', async () => {
      const data = { nameEn: 'New Deity', slug: 'new' };
      mockPrisma.deity.create.mockResolvedValue({ id: 'deity-99', ...data } as any);

      const result = await service.create(data as any);

      expect(mockPrisma.deity.create).toHaveBeenCalledWith({ data });
      expect(result.slug).toBe('new');
    });
  });

  // ── update ─────────────────────────────────────────────────────────────────
  describe('update', () => {
    it('updates a deity and returns the updated record', async () => {
      const updated = { ...mockDeity, nameEn: 'Updated Name' };
      mockPrisma.deity.findUniqueOrThrow.mockResolvedValue(mockDeity);
      mockPrisma.deity.update.mockResolvedValue(updated);

      const result = await service.update('deity-1', { nameEn: 'Updated Name' } as any);

      expect(mockPrisma.deity.findUniqueOrThrow).toHaveBeenCalledWith({ where: { id: 'deity-1' } });
      expect(mockPrisma.deity.update).toHaveBeenCalledWith({
        where: { id: 'deity-1' },
        data: { nameEn: 'Updated Name' },
      });
      expect(result.nameEn).toBe('Updated Name');
    });

    it('throws when deity id not found (Prisma findUniqueOrThrow)', async () => {
      mockPrisma.deity.findUniqueOrThrow.mockRejectedValue(new Error('Not found'));
      await expect(service.update('bad-id', {})).rejects.toThrow('Not found');
    });
  });

  // ── remove ─────────────────────────────────────────────────────────────────
  describe('remove', () => {
    it('deletes the deity and returns the deleted record', async () => {
      mockPrisma.deity.findUniqueOrThrow.mockResolvedValue(mockDeity);
      mockPrisma.deity.delete.mockResolvedValue(mockDeity);

      const result = await service.remove('deity-1');

      expect(mockPrisma.deity.delete).toHaveBeenCalledWith({ where: { id: 'deity-1' } });
      expect(result).toEqual(mockDeity);
    });

    it('propagates Prisma error when deity not found on delete', async () => {
      mockPrisma.deity.findUniqueOrThrow.mockRejectedValue(new Error('Record not found'));
      await expect(service.remove('bad-id')).rejects.toThrow('Record not found');
    });
  });
});
