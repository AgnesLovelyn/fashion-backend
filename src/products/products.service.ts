import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(category?: string, search?: string) {
    return this.prisma.product.findMany({
      where: { 
      AND: [
      category? {category: { slug: category } } : {},
      search ? {
      OR: [
         { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
      ]
      } : {}
      ]
    },
      include: { category: true, variants: true },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true, variants: true },
    });
    if (!product) throw new NotFoundException('Produk tidak ditemukan');
    return product;
  }

  async create(data: {
    name: string;
    description?: string;
    price: number;
    stock: number;
    imageUrl?: string;
    categoryId: number;
    isNew?: boolean;
    isTrending?: boolean;
  }) {
    return this.prisma.product.create({ data });
  }

  async update(id: number, data: Partial<{
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    categoryId: number;
    isNew: boolean;
    isTrending: boolean;
  }>) {
    await this.findOne(id);
    return this.prisma.product.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }
  async addVariant(productId: number, data: {
  size: string;
  color: string;
  stock: number;
}) {
  await this.findOne(productId);
  return this.prisma.productVariant.create({
    data: { productId, ...data },
  });
}

async getVariants(productId: number) {
  await this.findOne(productId);
  return this.prisma.productVariant.findMany({
    where: { productId },
  });
}
async updateVariant(variantId: number, data: Partial<{
  size: string;
  color: string;
  stock: number;
  imageUrl: string;
}>) {
  const variant = await this.prisma.productVariant.findUnique({ where: { id: variantId } });
  if (!variant) throw new NotFoundException('Varian tidak ditemukan');
  return this.prisma.productVariant.update({ where: { id: variantId }, data });
}
}