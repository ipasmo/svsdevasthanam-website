import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

// ── bcrypt mock ───────────────────────────────────────────────────────────────
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

const mockUser = {
  id: 'user-1',
  name: 'Admin',
  email: 'admin@temple.org',
  password: 'hashed-password',
  role: 'ADMIN',
  isActive: true,
  lastLogin: null,
  refreshToken: null,
};

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

const mockJwt = {
  sign: jest.fn().mockReturnValue('mock-jwt-token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  // ── login ──────────────────────────────────────────────────────────────────
  describe('login', () => {
    it('returns user (without password) and token on valid credentials', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockPrisma.user.update.mockResolvedValue(mockUser);

      const result = await service.login({ email: 'admin@temple.org', password: 'Secret123' });

      expect(result).toHaveProperty('token', 'mock-jwt-token');
      expect(result.user).not.toHaveProperty('password');
      expect(result.user.email).toBe('admin@temple.org');
    });

    it('throws UnauthorizedException when user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'nobody@temple.org', password: 'pw' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when user is inactive', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ ...mockUser, isActive: false });

      await expect(
        service.login({ email: 'admin@temple.org', password: 'pw' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when password is wrong', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ email: 'admin@temple.org', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('updates lastLogin on successful login', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockPrisma.user.update.mockResolvedValue(mockUser);

      await service.login({ email: 'admin@temple.org', password: 'Secret123' });

      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'user-1' } }),
      );
    });

    it('signs JWT with correct payload', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockPrisma.user.update.mockResolvedValue(mockUser);

      await service.login({ email: 'admin@temple.org', password: 'Secret123' });

      expect(mockJwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({ sub: 'user-1', email: 'admin@temple.org' }),
      );
    });
  });

  // ── getProfile ────────────────────────────────────────────────────────────
  describe('getProfile', () => {
    it('returns profile via prisma findUnique', async () => {
      const profile = {
        id: 'user-1',
        name: 'Admin',
        email: 'admin@temple.org',
        role: 'ADMIN',
        isActive: true,
        lastLogin: null,
      };
      mockPrisma.user.findUnique.mockResolvedValue(profile);

      const result = await service.getProfile('user-1');
      expect(result).toEqual(profile);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'user-1' } }),
      );
    });
  });

  // ── logout ────────────────────────────────────────────────────────────────
  describe('logout', () => {
    it('clears refreshToken and returns success message', async () => {
      mockPrisma.user.update.mockResolvedValue(mockUser);

      const result = await service.logout('user-1');

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { refreshToken: null },
      });
      expect(result).toEqual({ message: expect.stringContaining('Logged out') });
    });
  });
});
