import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: number) {
    return this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });
  }

  async addItem(userId: number, data: {
    productId: number;
    quantity: number;
    size: string;
    color: string;
  }) {
    
    // Cek apakah item sudah ada di keranjang
    const existing = await this.prisma.cartItem.findUnique({
      where: {
        userId_productId_size_color: {
          userId,
          productId: data.productId,
          size: data.size,
          color: data.color,
        },
      },
    });

    // Kalau sudah ada, update quantity
    if (existing) {
      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + data.quantity },
      });
    }

    // Kalau belum ada, buat baru
    return this.prisma.cartItem.create({
      data: { userId, ...data },
    });
  }

  async updateItem(id: number, userId: number, quantity: number) {
    const item = await this.prisma.cartItem.findUnique({ where: { id } });
    if (!item || item.userId !== userId) throw new NotFoundException('Item tidak ditemukan');
    return this.prisma.cartItem.update({ where: { id }, data: { quantity } });
  }

  async removeItem(id: number, userId: number) {
    const item = await this.prisma.cartItem.findUnique({ where: { id } });
    if (!item || item.userId !== userId) throw new NotFoundException('Item tidak ditemukan');
    return this.prisma.cartItem.delete({ where: { id } });
  }
}