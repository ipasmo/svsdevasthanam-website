import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, isActive: true, lastLogin: true, createdAt: true },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, isActive: true, lastLogin: true },
    });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async create(data: { name: string; email: string; password: string; role?: any }) {
    const exists = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (exists) throw new ConflictException('Email already in use');
    const hash = await bcrypt.hash(data.password, 12);
    return this.prisma.user.create({ data: { ...data, password: hash } });
  }

  async update(id: string, data: Partial<{ name: string; isActive: boolean; role: any }>) {
    await this.findOne(id);
    return this.prisma.user.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.user.delete({ where: { id } });
  }
}
