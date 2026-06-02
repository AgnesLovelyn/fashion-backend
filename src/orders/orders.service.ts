import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from 'cloudinary/cloudinary.service'; // Pastikan path ini benar sesuai struktur foldermu
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async createOrder(userId: number, dto: CreateOrderDto, file: Express.Multer.File) {
    // 1. Validasi file
    if (!file) {
      throw new BadRequestException('Bukti pembayaran wajib diupload (image)');
    }

    // 2. Pastikan cartItemIds jadi array number (antisipasi string dari form-data)
    const cartItemIds = Array.isArray(dto.cartItemIds) 
      ? dto.cartItemIds.map((id) => Number(id))
      : [Number(dto.cartItemIds)];

    // 3. Cari item di keranjang
    const cartItems = await this.prisma.cartItem.findMany({
      where: { 
        id: { in: cartItemIds }, 
        userId 
      },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      throw new NotFoundException('Cart item tidak ditemukan atau sudah diproses');
    }

    // 4. Upload Bukti ke Cloudinary (pake 'as any' biar TS ga rewel)
    const uploadResult = await this.cloudinaryService.uploadImage(file);
    const proofUrl = (uploadResult as any).secure_url || (uploadResult as any).url;

    // 5. Hitung total harga
    const totalPrice = cartItems.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity;
    }, 0);

    // 6. Buat Order
    const order = await this.prisma.order.create({
      data: {
        userId,
        addressId: Number(dto.addressId),
        totalPrice,
        proofOfPayment: proofUrl,
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

    // 7. Bersihkan keranjang
    await this.prisma.cartItem.deleteMany({
      where: { id: { in: cartItemIds } },
    });

    return order;
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: { 
        user: true, 
        address: true, 
        items: { include: { product: true } } 
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findMyOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { 
        address: true, 
        items: { include: { product: true } } 
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: number, status: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) throw new NotFoundException('Order tidak ditemukan');

    // Potong stok jika sukses
    if (status === 'SUCCESS' && order.status !== 'SUCCESS') {
      for (const item of order.items) {
        await this.prisma.productVariant.updateMany({
          where: {
            productId: item.productId,
            size: item.size,
            color: item.color,
          },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: status as any },
    });
  }
}