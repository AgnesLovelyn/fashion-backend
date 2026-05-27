import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    const totalUsers = await this.prisma.user.count();
    const totalOrders = await this.prisma.order.count();
    const totalProducts = await this.prisma.product.count();

    const revenueData = await this.prisma.order.aggregate({
      _sum: { totalPrice: true },
    });
    const totalRevenue = revenueData._sum.totalPrice ?? 0;

    const recentOrders = await this.prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        address: true,
        items: { include: { product: true } },
      },
    });

    const topProducts = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });

    const topProductsDetail = await Promise.all(
      topProducts.map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });
        return { product, totalSold: item._sum.quantity };
      }),
    );

    const orderByStatus = await this.prisma.order.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    return {
      totalUsers,
      totalOrders,
      totalRevenue,
      totalProducts,
      recentOrders,
      topProducts: topProductsDetail,
      orderByStatus,
    };
  }
}