import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { FestivalsService } from './festivals.service';
import { PrismaService } from '../prisma/prisma.service';

const mockFestival = {
  id: 'festival-1',
  slug: 'rama-navami',
  nameEn: 'Rama Navami',
  nameTe: null as string | null,
  nameHi: null as string | null,
  descriptionEn: 'Birth anniversary of Lord Rama',
  month: 'March / April',
  date: null as Date | null,
  icon: '🏹',
  isHighlighted: false,
  orderIndex: 2,
  isActive: true,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

const mockPrisma = {
  festival: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('FestivalsService', () => {
  let service: FestivalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FestivalsService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<FestivalsService>(FestivalsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findActive', () => {
    it('returns only active festivals ordered by orderIndex', async () => {
      mockPrisma.festival.findMany.mockResolvedValue([mockFestival]);

      await expect(service.findActive()).resolves.toEqual([mockFestival]);
      expect(mockPrisma.festival.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { orderIndex: 'asc' },
      });
    });
  });

  describe('findAll', () => {
    it('includes inactive festivals for admins', async () => {
      mockPrisma.festival.findMany.mockResolvedValue([mockFestival]);

      await service.findAll();
      expect(mockPrisma.festival.findMany).toHaveBeenCalledWith({ orderBy: { orderIndex: 'asc' } });
    });
  });

  describe('findBySlug', () => {
    it('returns an active festival', async () => {
      mockPrisma.festival.findUnique.mockResolvedValue(mockFestival);
      await expect(service.findBySlug('rama-navami')).resolves.toEqual(mockFestival);
    });

    it('throws NotFoundException when the slug does not exist', async () => {
      mockPrisma.festival.findUnique.mockResolvedValue(null);
      await expect(service.findBySlug('unknown')).rejects.toThrow(NotFoundException);
    });

    it('hides inactive festivals from the public', async () => {
      mockPrisma.festival.findUnique.mockResolvedValue({ ...mockFestival, isActive: false });
      await expect(service.findBySlug('rama-navami')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('converts a date-only string to a Date', async () => {
      mockPrisma.festival.findUnique.mockResolvedValue(null);
      mockPrisma.festival.create.mockResolvedValue(mockFestival);

      await service.create({ slug: 'rama-navami', nameEn: 'Rama Navami', date: '2027-04-15' });
      expect(mockPrisma.festival.create).toHaveBeenCalledWith({
        data: { slug: 'rama-navami', nameEn: 'Rama Navami', date: new Date('2027-04-15') },
      });
    });

    it('allows a festival without month or date', async () => {
      mockPrisma.festival.findUnique.mockResolvedValue(null);
      mockPrisma.festival.create.mockResolvedValue(mockFestival);

      await service.create({ slug: 'karthika-masa', nameEn: 'Karthika Masa' });
      expect(mockPrisma.festival.create).toHaveBeenCalledWith({
        data: { slug: 'karthika-masa', nameEn: 'Karthika Masa', date: undefined },
      });
    });

    it('rejects a duplicate slug', async () => {
      mockPrisma.festival.findUnique.mockResolvedValue(mockFestival);

      await expect(service.create({ slug: 'rama-navami', nameEn: 'Duplicate' })).rejects.toThrow(ConflictException);
      expect(mockPrisma.festival.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('throws NotFoundException for an unknown id', async () => {
      mockPrisma.festival.findUnique.mockResolvedValue(null);

      await expect(service.update('missing', { nameEn: 'X' })).rejects.toThrow(NotFoundException);
      expect(mockPrisma.festival.update).not.toHaveBeenCalled();
    });

    it('allows keeping its own slug', async () => {
      mockPrisma.festival.findUnique.mockResolvedValue(mockFestival);
      mockPrisma.festival.update.mockResolvedValue(mockFestival);

      await service.update('festival-1', { slug: 'rama-navami', month: 'April' });
      expect(mockPrisma.festival.update).toHaveBeenCalledWith({
        where: { id: 'festival-1' },
        data: { slug: 'rama-navami', month: 'April', date: undefined },
      });
    });

    it('rejects a slug used by another festival', async () => {
      mockPrisma.festival.findUnique
        .mockResolvedValueOnce(mockFestival)
        .mockResolvedValueOnce({ ...mockFestival, id: 'festival-2' });

      await expect(service.update('festival-1', { slug: 'ugadi' })).rejects.toThrow(ConflictException);
    });

    it('clears the date when null is sent', async () => {
      mockPrisma.festival.findUnique.mockResolvedValue(mockFestival);
      mockPrisma.festival.update.mockResolvedValue(mockFestival);

      await service.update('festival-1', { date: null });
      expect(mockPrisma.festival.update).toHaveBeenCalledWith({ where: { id: 'festival-1' }, data: { date: null } });
    });
  });

  describe('remove', () => {
    it('throws NotFoundException for an unknown id', async () => {
      mockPrisma.festival.findUnique.mockResolvedValue(null);
      await expect(service.remove('missing')).rejects.toThrow(NotFoundException);
    });

    it('deletes an existing festival', async () => {
      mockPrisma.festival.findUnique.mockResolvedValue(mockFestival);
      mockPrisma.festival.delete.mockResolvedValue(mockFestival);

      await service.remove('festival-1');
      expect(mockPrisma.festival.delete).toHaveBeenCalledWith({ where: { id: 'festival-1' } });
    });
  });
});
