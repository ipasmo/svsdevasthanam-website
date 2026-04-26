import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import { DonationsService } from './donations.service';
import { PrismaService } from '../prisma/prisma.service';

// ── Mock Razorpay at module level ─────────────────────────────────────────────
const mockRazorpayOrdersCreate = jest.fn();
jest.mock('razorpay', () =>
  jest.fn().mockImplementation(() => ({
    orders: { create: mockRazorpayOrdersCreate },
  })),
);

const mockPrisma = {
  donation: {
    create: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    aggregate: jest.fn(),
  },
};

// ── Env setup ─────────────────────────────────────────────────────────────────
const RAZORPAY_KEY_SECRET = 'test-secret';

beforeAll(() => {
  process.env.RAZORPAY_KEY_ID = 'test-key-id';
  process.env.RAZORPAY_KEY_SECRET = RAZORPAY_KEY_SECRET;
});

describe('DonationsService', () => {
  let service: DonationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DonationsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<DonationsService>(DonationsService);
  });

  afterEach(() => jest.clearAllMocks());

  // ── createOrder ────────────────────────────────────────────────────────────
  describe('createOrder', () => {
    it('creates a Razorpay order and a Prisma donation record', async () => {
      const razorpayOrder = { id: 'order_abc123', amount: 50100, currency: 'INR' };
      mockRazorpayOrdersCreate.mockResolvedValue(razorpayOrder);
      const prismaRecord = { id: 'donation-1' };
      mockPrisma.donation.create.mockResolvedValue(prismaRecord);

      const body = {
        amount: 501,
        purpose: 'GENERAL',
        donorName: 'Test Donor',
        donorEmail: 'donor@example.com',
        donorPhone: '9876543210',
      };

      const result = await service.createOrder(body);

      expect(mockRazorpayOrdersCreate).toHaveBeenCalledWith({
        amount: 50100,
        currency: 'INR',
        notes: { purpose: 'GENERAL' },
      });
      expect(mockPrisma.donation.create).toHaveBeenCalled();
      expect(result.donationId).toBe('donation-1');
      expect(result.id).toBe('order_abc123');
    });

    it('converts amount to paise correctly', async () => {
      mockRazorpayOrdersCreate.mockResolvedValue({ id: 'order_x', amount: 10000 });
      mockPrisma.donation.create.mockResolvedValue({ id: 'd-1' });

      await service.createOrder({
        amount: 100,
        purpose: 'ANNADANAM',
        donorName: 'Donor',
        donorEmail: 'd@d.com',
        donorPhone: '9876543210',
      });

      expect(mockRazorpayOrdersCreate).toHaveBeenCalledWith(
        expect.objectContaining({ amount: 10000 }),
      );
    });
  });

  // ── verifyPayment ──────────────────────────────────────────────────────────
  describe('verifyPayment', () => {
    const buildSignature = (orderId: string, paymentId: string) =>
      crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

    it('returns success when signature is valid', async () => {
      const orderId = 'order_1';
      const paymentId = 'pay_1';
      const signature = buildSignature(orderId, paymentId);
      mockPrisma.donation.update.mockResolvedValue({});

      const result = await service.verifyPayment({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
      });

      expect(result).toEqual({ success: true, message: expect.stringContaining('verified') });
      expect(mockPrisma.donation.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { razorpayOrderId: orderId } }),
      );
    });

    it('updates donation status to COMPLETED on success', async () => {
      const orderId = 'order_2';
      const paymentId = 'pay_2';
      const signature = buildSignature(orderId, paymentId);
      mockPrisma.donation.update.mockResolvedValue({});

      await service.verifyPayment({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
      });

      expect(mockPrisma.donation.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'COMPLETED' }),
        }),
      );
    });

    it('throws BadRequestException when signature is invalid', async () => {
      await expect(
        service.verifyPayment({
          razorpay_order_id: 'order_bad',
          razorpay_payment_id: 'pay_bad',
          razorpay_signature: 'wrong-signature',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ── findAll ────────────────────────────────────────────────────────────────
  describe('findAll', () => {
    it('returns paginated donations ordered by createdAt desc', async () => {
      const donations = [{ id: 'd-1' }, { id: 'd-2' }];
      mockPrisma.donation.findMany.mockResolvedValue(donations);

      const result = await service.findAll(1, 20);

      expect(mockPrisma.donation.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 20,
      });
      expect(result).toEqual(donations);
    });

    it('calculates skip correctly for page 2', async () => {
      mockPrisma.donation.findMany.mockResolvedValue([]);
      await service.findAll(2, 10);
      expect(mockPrisma.donation.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 10, take: 10 }),
      );
    });
  });

  // ── getStats ───────────────────────────────────────────────────────────────
  describe('getStats', () => {
    it('aggregates sum and count of COMPLETED donations', async () => {
      const stats = { _sum: { amount: 50000 }, _count: { id: 100 } };
      mockPrisma.donation.aggregate.mockResolvedValue(stats);

      const result = await service.getStats();

      expect(mockPrisma.donation.aggregate).toHaveBeenCalledWith(
        expect.objectContaining({ where: { status: 'COMPLETED' } }),
      );
      expect(result).toEqual(stats);
    });
  });
});
