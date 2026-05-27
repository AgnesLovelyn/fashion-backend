import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number) {
    return this.prisma.address.findMany({
      where: { userId },
    });
  }

  async create(userId: number, data: {
    label: string;
    street: string;
    city: string;
    province: string;
    postalCode: string;
  }) {
    return this.prisma.address.create({
      data: { userId, ...data },
    });
  }

  async remove(id: number, userId: number) {
    const address = await this.prisma.address.findUnique({ where: { id } });
    if (!address || address.userId !== userId) {
      throw new NotFoundException('Alamat tidak ditemukan');
    }
    return this.prisma.address.delete({ where: { id } });
  }
}