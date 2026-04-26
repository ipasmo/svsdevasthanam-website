import { Test, TestingModule } from '@nestjs/testing';
import { DeitiesController } from './deities.controller';
import { DeitiesService } from './deities.service';

const mockDeitiesService = {
  findAll: jest.fn(),
  findBySlug: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mockDeity = {
  id: 'deity-1',
  nameEn: 'Sri Venkateshwara Swamy',
  nameTe: null as string | null,
  nameHi: null as string | null,
  slug: 'venkateshwara',
  isActive: true,
  orderIndex: 1,
};

describe('DeitiesController', () => {
  let controller: DeitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeitiesController],
      providers: [{ provide: DeitiesService, useValue: mockDeitiesService }],
    }).compile();

    controller = module.get<DeitiesController>(DeitiesController);
  });

  afterEach(() => jest.clearAllMocks());

  // ── GET /deities ───────────────────────────────────────────────────────────
  describe('findAll', () => {
    it('returns all deities from service', async () => {
      mockDeitiesService.findAll.mockResolvedValue([mockDeity]);
      const result = await controller.findAll();
      expect(mockDeitiesService.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockDeity]);
    });
  });

  // ── GET /deities/:slug ─────────────────────────────────────────────────────
  describe('findOne', () => {
    it('delegates to findBySlug with the slug param', async () => {
      mockDeitiesService.findBySlug.mockResolvedValue(mockDeity);
      const result = await controller.findOne('venkateshwara');
      expect(mockDeitiesService.findBySlug).toHaveBeenCalledWith('venkateshwara');
      expect(result).toEqual(mockDeity);
    });
  });

  // ── POST /deities ──────────────────────────────────────────────────────────
  describe('create', () => {
    it('delegates to service.create with request body', async () => {
      const body = { nameEn: 'New Deity', slug: 'new-deity' };
      const created = { id: 'deity-99', ...body };
      mockDeitiesService.create.mockResolvedValue(created);

      const result = await controller.create(body as any);

      expect(mockDeitiesService.create).toHaveBeenCalledWith(body);
      expect(result).toEqual(created);
    });
  });

  // ── PATCH /deities/:id ─────────────────────────────────────────────────────
  describe('update', () => {
    it('delegates to service.update with id and body', async () => {
      const body = { nameEn: 'Updated' };
      mockDeitiesService.update.mockResolvedValue({ ...mockDeity, ...body });

      const result = await controller.update('deity-1', body as any);

      expect(mockDeitiesService.update).toHaveBeenCalledWith('deity-1', body);
      expect(result.nameEn).toBe('Updated');
    });
  });

  // ── DELETE /deities/:id ────────────────────────────────────────────────────
  describe('remove', () => {
    it('delegates to service.remove with id', async () => {
      mockDeitiesService.remove.mockResolvedValue(mockDeity);

      const result = await controller.remove('deity-1');

      expect(mockDeitiesService.remove).toHaveBeenCalledWith('deity-1');
      expect(result).toEqual(mockDeity);
    });
  });
});
