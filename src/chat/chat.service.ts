import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  // User kirim pesan ke admin
  async sendMessage(userId: number, content: string) {
    return this.prisma.message.create({
      data: { userId, content, isAdmin: false },
      include: { user: { select: { name: true } } },
    });
  }

  // Admin balas pesan ke user tertentu
  async replyMessage(userId: number, content: string) {
    return this.prisma.message.create({
      data: { userId, content, isAdmin: true },
      include: { user: { select: { name: true } } },
    });
  }

  // User lihat percakapannya sendiri
  async getMyMessages(userId: number) {
    return this.prisma.message.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      include: { user: { select: { name: true } } },
    });
  }

  // Admin lihat semua percakapan (dikelompokkan per user)
  async getAllMessages() {
    return this.prisma.message.findMany({
      orderBy: { createdAt: 'asc' },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }

  // Admin lihat percakapan dengan user tertentu
  async getMessagesByUser(userId: number) {
    return this.prisma.message.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      include: { user: { select: { name: true, email: true } } },
    });
  }
}