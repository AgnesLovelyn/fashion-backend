import { Injectable, NotFoundException,ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
   constructor(private prisma: PrismaService) {}

 //Mengambil data profil diri sendiri
  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true, 
        name: true, 
        email: true, 
        role: true, 
        createdAt: true 
      },
    });

    if (!user) throw new NotFoundException('User tidak ditemukan');
    return user;
  }

  //Mengambil semua daftar user (Admin Only)

  async findAll() {
    return this.prisma.user.findMany({
      select: { 
        id: true, 
        name: true, 
        email: true, 
        role: true, 
        createdAt: true 
      },
      orderBy: { createdAt: 'desc' }, // Diurutkan dari yang terbaru daftar
    });
  }

  //Menghapus user (Admin Only)

  async remove(id: number, currentAdminId: number) {
    // Validasi: Admin tidak boleh menghapus akunnya sendiri
    if (id === currentAdminId) {
      throw new ForbiddenException('Anda tidak bisa menghapus akun admin Anda sendiri');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User tidak ditemukan');

    return await this.prisma.user.delete({
      where: { id },
      select: { name: true, email: true } // Mengembalikan info user yang dihapus
    });
  }

  //Mengubah Role User (Admin Only)
   
  async updateRole(id: number, role: Role) {
    // Cek apakah user memang ada
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User tidak ditemukan');

    // Jika role yang dikirim sama dengan role sekarang, tidak perlu update
    if (user.role === role) {
      return { message: `User sudah memiliki role ${role}`, data: user };
    }

    return await this.prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, role: true }
    });
  }
}

