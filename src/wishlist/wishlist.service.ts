import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async toggleWishlist(userId: number, productId: number) {
    //cek produk sudah ada belom
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');
    
    const existing = await this.prisma.wishlist.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existing) {
      await this.prisma.wishlist.delete({ where: { id: existing.id } });
      return { message: 'Removed from wishlist', status: false };
    }

    const newWishlist = await this.prisma.wishlist.create({
      data: { userId, productId },
      include: { product: true },
    });
    return { message: 'Added to wishlist', data: newWishlist, status: true };
  }

  async getMyWishlist(userId: number) {
    return this.prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: { category: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}