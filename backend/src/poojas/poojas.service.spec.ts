import { Test, TestingModule } from '@nestjs/testing';
import { PoojasService } from './poojas.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = {
  pooja: {
    findMany: jest.fn(),
  },
};

describe('PoojasService', () => {
  let service: PoojasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PoojasService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<PoojasService>(PoojasService);
  });

  afterEach(() => jest.clearAllMocks());

  it('returns only active poojas ordered by sortOrder', async () => {
    const poojas = [{ id: 'p1', nameEn: 'Suprabhatam', sortOrder: 1, isActive: true }];
    mockPrisma.pooja.findMany.mockResolvedValue(poojas);

    await expect(service.findActive()).resolves.toEqual(poojas);
    expect(mockPrisma.pooja.findMany).toHaveBeenCalledWith({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  });
});
