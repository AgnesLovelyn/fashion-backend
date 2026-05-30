import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { RolesGuard } from '../jwt/roles.guard';
import { Roles } from '../jwt/roles.decorator';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
@ApiOperation({ summary: 'Ambil semua produk' })
findAll(@Query('category') category?: string) {
  return this.productsService.findAll(category);
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        stock: { type: 'number' },
        categoryId: { type: 'number' },
        isNew: { type: 'boolean' },
        isTrending: { type: 'boolean' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
    @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  async create(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let imageUrl: string | undefined;
    if (file) {
      imageUrl = await this.cloudinaryService.uploadImage(file);
    }
    return this.productsService.create({
      ...body,
      price: Number(body.price),
      stock: Number(body.stock),
      categoryId: Number(body.categoryId),
      isNew: body.isNew === 'true',
      isTrending: body.isTrending === 'true',
      imageUrl,
    });
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update produk (admin)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        stock: { type: 'number' },
        categoryId: { type: 'number' },
        isNew: { type: 'boolean' },
        isTrending: { type: 'boolean' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
 @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const data: any = { ...body };
    if (file) {
      data.imageUrl = await this.cloudinaryService.uploadImage(file);
    }
    if (body.price) data.price = Number(body.price);
    if (body.stock) data.stock = Number(body.stock);
    if (body.categoryId) data.categoryId = Number(body.categoryId);
    if (body.isNew !== undefined) data.isNew = body.isNew === 'true';
    if (body.isTrending !== undefined) data.isTrending = body.isTrending === 'true';
    return this.productsService.update(+id, data);
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
      example: { size: 'M', color: 'Black', stock: 15 },
    },
  })
  addVariant(
    @Param('id') id: string,
    @Body() body: { size: string; color: string; stock: number },
  ) {
    return this.productsService.addVariant(+id, body);
  }
}