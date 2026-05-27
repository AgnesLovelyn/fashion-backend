import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: number, addressId: number, cartItemIds: number[]) {
    // Ambil cart items yang dipilih
    const cartItems = await this.prisma.cartItem.findMany({
      where: { id: { in: cartItemIds }, userId },
      include: { product: true },
    });

    if (cartItems.length === 0) throw new NotFoundException('Cart item tidak ditemukan');

    // Hitung total harga
    const totalPrice = cartItems.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity;
    }, 0);

    // Buat order
    const order = await this.prisma.order.create({
      data: {
        userId,
        addressId,
        totalPrice,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
            size: item.size,
            color: item.color,
          })),
        },
      },
      include: { items: true },
    });

    // Hapus cart items yang sudah diorder
    await this.prisma.cartItem.deleteMany({
      where: { id: { in: cartItemIds } },
    });

    return order;
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: { user: true, address: true, items: { include: { product: true } } },
    });
  }

  async findMyOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { address: true, items: { include: { product: true } } },
    });
  }
}