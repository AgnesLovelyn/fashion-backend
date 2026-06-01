import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  // User kirim pesan ke admin (terikat ke produk tertentu)
  async sendMessage(userId: number, content: string, productId?: number) {
    return this.prisma.message.create({
      data: { userId, content, isAdmin: false, productId },
      include: { 
        user: { select: { name: true } },
        product: { select: { id: true, name: true } },
      },
    });
  }

  // Admin balas pesan ke user tertentu (terikat ke produk tertentu)
  async replyMessage(userId: number, content: string, productId?: number) {
    return this.prisma.message.create({
      data: { userId, content, isAdmin: true, productId },
      include: { 
        user: { select: { name: true } },
        product: { select: { id: true, name: true } },
      },
    });
  }

  // User lihat percakapannya sendiri (bisa filter by produk)
  async getMyMessages(userId: number, productId?: number) {
    return this.prisma.message.findMany({
      where: {
        userId,
        ...(productId ? { productId } : {}),
      },
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { name: true } },
        product: { select: { id: true, name: true } },
      },
    });
  }

  // Admin lihat semua percakapan 
  async getAllMessages(productId?: number) {
    return this.prisma.message.findMany({
      where: productId ? { productId } : {},
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        product: { select: { id: true, name: true } },
      },
    });
  }

  // Admin lihat percakapan dengan user tertentu  (bisa filter by produk)
  async getMessagesByUser(userId: number, productId?: number) {
    return this.prisma.message.findMany({
      where: {
        userId,
        ...(productId ? { productId } : {}),
      },
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { name: true, email: true } },
        product: { select: { id: true, name: true } },
      },
    });
  }
}