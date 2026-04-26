import { Test, TestingModule } from '@nestjs/testing';
import { AnnouncementsService } from './announcements.service';
import { PrismaService } from '../prisma/prisma.service';

const mockAnnouncement = {
  id: 'ann-1',
  titleEn: 'Temple special pooja',
  titleTe: null as string | null,
  titleHi: null as string | null,
  isActive: true,
  isImportant: true,
  expiresAt: null as Date | null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

const mockPrisma = {
  announcement: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('AnnouncementsService', () => {
  let service: AnnouncementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnnouncementsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AnnouncementsService>(AnnouncementsService);
  });

  afterEach(() => jest.clearAllMocks());

  // ── findActive ─────────────────────────────────────────────────────────────
  describe('findActive', () => {
    it('calls findMany with isActive: true and expiry filter', async () => {
      mockPrisma.announcement.findMany.mockResolvedValue([mockAnnouncement]);

      const result = await service.findActive();

      expect(mockPrisma.announcement.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ isActive: true }),
        }),
      );
      expect(result).toEqual([mockAnnouncement]);
    });

    it('orders by isImportant desc, then createdAt desc', async () => {
      mockPrisma.announcement.findMany.mockResolvedValue([]);

      await service.findActive();

      expect(mockPrisma.announcement.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ isImportant: 'desc' }, { createdAt: 'desc' }],
        }),
      );
    });

    it('includes OR clause for null/future expiresAt', async () => {
      mockPrisma.announcement.findMany.mockResolvedValue([]);

      await service.findActive();

      const call = mockPrisma.announcement.findMany.mock.calls[0][0];
      expect(call.where.OR).toBeDefined();
      expect(call.where.OR[0]).toEqual({ expiresAt: null });
    });

    it('returns empty array when no active announcements', async () => {
      mockPrisma.announcement.findMany.mockResolvedValue([]);
      expect(await service.findActive()).toEqual([]);
    });
  });

  // ── findAll ────────────────────────────────────────────────────────────────
  describe('findAll', () => {
    it('returns all announcements ordered by createdAt desc', async () => {
      const list = [mockAnnouncement, { ...mockAnnouncement, id: 'ann-2', isActive: false }];
      mockPrisma.announcement.findMany.mockResolvedValue(list);

      const result = await service.findAll();

      expect(mockPrisma.announcement.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(2);
    });
  });

  // ── create ─────────────────────────────────────────────────────────────────
  describe('create', () => {
    it('creates an announcement and returns it', async () => {
      const data = { titleEn: 'New Event', isActive: true, isImportant: false };
      mockPrisma.announcement.create.mockResolvedValue({ id: 'ann-99', ...data } as any);

      const result = await service.create(data as any);

      expect(mockPrisma.announcement.create).toHaveBeenCalledWith({ data });
      expect(result.titleEn).toBe('New Event');
    });
  });

  // ── update ─────────────────────────────────────────────────────────────────
  describe('update', () => {
    it('updates and returns the announcement', async () => {
      const updated = { ...mockAnnouncement, titleEn: 'Updated Title' };
      mockPrisma.announcement.update.mockResolvedValue(updated);

      const result = await service.update('ann-1', { titleEn: 'Updated Title' } as any);

      expect(mockPrisma.announcement.update).toHaveBeenCalledWith({
        where: { id: 'ann-1' },
        data: { titleEn: 'Updated Title' },
      });
      expect(result.titleEn).toBe('Updated Title');
    });
  });

  // ── remove ─────────────────────────────────────────────────────────────────
  describe('remove', () => {
    it('deletes and returns the announcement', async () => {
      mockPrisma.announcement.delete.mockResolvedValue(mockAnnouncement);

      const result = await service.remove('ann-1');

      expect(mockPrisma.announcement.delete).toHaveBeenCalledWith({ where: { id: 'ann-1' } });
      expect(result).toEqual(mockAnnouncement);
    });
  });
});
