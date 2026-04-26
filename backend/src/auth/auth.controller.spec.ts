import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockAuthService = {
  login: jest.fn(),
  getProfile: jest.fn(),
  logout: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => jest.clearAllMocks());

  // ── POST /auth/login ──────────────────────────────────────────────────────
  describe('login', () => {
    it('delegates to authService.login with the dto', async () => {
      const dto = { email: 'admin@temple.org', password: 'Secret123' };
      const payload = { user: { id: '1', email: dto.email }, token: 'jwt' };
      mockAuthService.login.mockResolvedValue(payload);

      const result = await controller.login(dto);

      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual(payload);
    });
  });

  // ── GET /auth/profile ─────────────────────────────────────────────────────
  describe('getProfile', () => {
    it('delegates to authService.getProfile with req.user.id', async () => {
      const profile = { id: 'user-1', name: 'Admin', email: 'admin@temple.org' };
      mockAuthService.getProfile.mockResolvedValue(profile);

      const req = { user: { id: 'user-1' } };
      const result = await controller.getProfile(req);

      expect(mockAuthService.getProfile).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(profile);
    });
  });

  // ── POST /auth/logout ─────────────────────────────────────────────────────
  describe('logout', () => {
    it('delegates to authService.logout with req.user.id', async () => {
      mockAuthService.logout.mockResolvedValue({ message: 'Logged out successfully.' });

      const req = { user: { id: 'user-1' } };
      const result = await controller.logout(req);

      expect(mockAuthService.logout).toHaveBeenCalledWith('user-1');
      expect(result).toEqual({ message: 'Logged out successfully.' });
    });
  });
});
