import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { RolesGuard } from '../jwt/roles.guard';
import { Roles } from '../jwt/roles.decorator';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Ambil semua produk' })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil produk by ID' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Tambah produk baru (admin)' })
  @ApiBody({
    schema: {
      example: {
        name: 'Hoodie Zipper',
        description: 'Hoodie zipper oversize bahan fleece premium',
        price: 275000,
        stock: 90,
        categoryId: 1,
        isNew: true,
        isTrending: true,
      },
    },
  })
  create(@Body() body: {
    name: string;
    description?: string;
    price: number;
    stock: number;
    imageUrl?: string;
    categoryId: number;
    isNew?: boolean;
    isTrending?: boolean;
  }) {
    return this.productsService.create(body);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update produk (admin)' })
  @ApiBody({
    schema: {
      example: {
        name: 'Hoodie Zipper Updated',
        price: 300000,
        stock: 50,
        isTrending: false,
      },
    },
  })
  update(@Param('id') id: string, @Body() body: any) {
    return this.productsService.update(+id, body);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Hapus produk (admin)' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  @Get(':id/variants')
  @ApiOperation({ summary: 'Ambil varian produk by ID' })
  getVariants(@Param('id') id: string) {
    return this.productsService.getVariants(+id);
  }

  @Post(':id/variants')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Tambah varian produk (admin)' })
  @ApiBody({
    schema: {
      example: {
        size: 'M',
        color: 'Black',
        stock: 15,
      },
    },
  })
  addVariant(
    @Param('id') id: string,
    @Body() body: { size: string; color: string; stock: number },
  ) {
    return this.productsService.addVariant(+id, body);
  }
}