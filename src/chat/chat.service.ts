import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  // FUNGSI KUNCI: Biar FE dapet tulisan 'user' atau 'admin'
  private transformMessage(message: any) {
    return {
      ...message,
      sender: message.isAdmin ? 'admin' : 'user', // Ini yang dicari FE
    };
  }

  async sendMessage(userId: number, content: string, productId?: number) {
    const msg = await this.prisma.message.create({
      data: { userId, content, isAdmin: false, productId },
      include: { 
        user: { select: { name: true } },
        product: { select: { id: true, name: true } },
      },
    });
    return this.transformMessage(msg);
  }

  async replyMessage(userId: number, content: string, productId?: number) {
    const msg = await this.prisma.message.create({
      data: { userId, content, isAdmin: true, productId },
      include: { 
        user: { select: { name: true } },
        product: { select: { id: true, name: true } },
      },
    });
    return this.transformMessage(msg);
  }

  async getMyMessages(userId: number, productId?: number) {
    const messages = await this.prisma.message.findMany({
      where: { userId, ...(productId ? { productId } : {}) },
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { name: true } },
        product: { select: { id: true, name: true } },
      },
    });
    // PENTING: Pakai .map biar semua list pesan ada 'sender'-nya
    return messages.map((msg) => this.transformMessage(msg));
  }

  async getAllMessages(productId?: number) {
    const messages = await this.prisma.message.findMany({
      where: productId ? { productId } : {},
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        product: { select: { id: true, name: true } },
      },
    });
    // DISINI JUGA: Biar Admin pas liat "All Chat" juga tau siapa pengirimnya
    return messages.map((msg) => this.transformMessage(msg));
  }

  async getMessagesByUser(userId: number, productId?: number) {
    const messages = await this.prisma.message.findMany({
      where: { userId, ...(productId ? { productId } : {}) },
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { name: true, email: true } },
        product: { select: { id: true, name: true } },
      },
    });
    return messages.map((msg) => this.transformMessage(msg));
  }
}