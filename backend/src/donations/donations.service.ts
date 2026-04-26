import { Injectable, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Razorpay = require('razorpay');
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DonationsService {
  private razorpay: any;

  constructor(private prisma: PrismaService) {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  async createOrder(body: {
    amount: number;
    purpose: string;
    donorName: string;
    donorEmail: string;
    donorPhone: string;
    panCard?: string;
    message?: string;
  }) {
    const amountPaise = Math.round(body.amount * 100);
    const order = await this.razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      notes: { purpose: body.purpose },
    });

    const donation = await this.prisma.donation.create({
      data: {
        donorName: body.donorName,
        donorEmail: body.donorEmail,
        donorPhone: body.donorPhone,
        panCard: body.panCard,
        amount: body.amount,
        purpose: body.purpose,
        message: body.message,
        razorpayOrderId: order.id,
        status: 'PENDING',
      },
    });

    return { ...order, donationId: donation.id };
  }

  async verifyPayment(body: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET ?? '')
      .update(`${body.razorpay_order_id}|${body.razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== body.razorpay_signature) {
      throw new BadRequestException('Invalid payment signature');
    }

    await this.prisma.donation.update({
      where: { razorpayOrderId: body.razorpay_order_id },
      data: {
        razorpayPaymentId: body.razorpay_payment_id,
        razorpaySignature: body.razorpay_signature,
        status: 'COMPLETED',
      },
    });

    return { success: true, message: 'Payment verified successfully.' };
  }

  findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return this.prisma.donation.findMany({ orderBy: { createdAt: 'desc' }, skip, take: limit });
  }

  getStats() {
    return this.prisma.donation.aggregate({
      _sum: { amount: true },
      _count: { id: true },
      where: { status: 'COMPLETED' },
    });
  }
}
