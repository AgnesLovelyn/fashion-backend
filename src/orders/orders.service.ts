import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async createOrder(
    userId: number,
    dto: CreateOrderDto,
    file: Express.Multer.File,
  ) {
    // 1. Validasi file (Wajib ada bukti bayar)
    if (!file) {
      throw new BadRequestException('Bukti pembayaran wajib diupload (image)');
    }

    // 2. Bersihkan ID (Mencegah error NaN yang tadi)
    const cartItemIds = Array.isArray(dto.cartItemIds)
      ? dto.cartItemIds.map((id) => Number(id)).filter(id => !isNaN(id))
      : [Number(dto.cartItemIds)].filter(id => !isNaN(id));

    if (cartItemIds.length === 0) {
      throw new BadRequestException('ID Keranjang (cartItemIds) tidak valid atau kosong');
    }

    // 3. Cek Alamat (Mencegah Error 500 kalau ID alamat ngasal)
    const address = await this.prisma.address.findUnique({
      where: { id: Number(dto.addressId) },
    });

    if (!address) {
      throw new NotFoundException(`Alamat dengan ID ${dto.addressId} tidak ditemukan!`);
    }

    // 4. Cari item di keranjang
    const cartItems = await this.prisma.cartItem.findMany({
      where: {
        id: { in: cartItemIds },
        userId,
      },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      throw new NotFoundException('Barang di keranjang tidak ditemukan atau sudah diproses');
    }

    // 5. Upload Bukti ke Cloudinary
    let proofUrl: string;
    try {
      const uploadResult = await this.cloudinaryService.uploadImage(file);
      proofUrl = (uploadResult as any).secure_url || (uploadResult as any).url;
    } catch (error) {
      throw new BadRequestException('Gagal upload gambar ke Cloudinary');
    }

    // 6. Hitung total harga
    const totalPrice = cartItems.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity;
    }, 0);

    // 7. Eksekusi Create Order (Dibungkus Try-Catch agar tidak Error 500)
    try {
      return await this.prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
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

        // 8. Bersihkan keranjang HANYA jika order berhasil
        await tx.cartItem.deleteMany({
          where: { id: { in: cartItemIds } },
        });

        return order;
      });
    } catch (error) {
      console.error('DATABASE ERROR:', error);
      throw new BadRequestException('Gagal membuat order. Cek apakah ID Alamat dan ID Keranjang sudah benar.');
    }
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        user: true,
        address: true,
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findMyOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        address: true,
        items: { include: { product: true } },
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

    // Potong stok jika admin mengubah status jadi SUCCESS
    if (status === 'SUCCESS' && order.status !== 'SUCCESS') {
      for (const item of order.items) {
        // Cari varian yang tepat berdasarkan warna & ukuran
        const variant = await this.prisma.productVariant.findFirst({
          where: {
            productId: item.productId,
            size: item.size,
            color: item.color,
          },
        });

        if (variant) {
          // Pastikan stok cukup sebelum dikurangi
          if (variant.stock < item.quantity) {
            throw new BadRequestException(`Stok untuk ${item.size}-${item.color} tidak mencukupi!`);
          }

          await this.prisma.productVariant.update({
            where: { id: variant.id },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: status as any },
    });
  }
}