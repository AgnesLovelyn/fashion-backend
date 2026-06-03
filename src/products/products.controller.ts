import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { RolesGuard } from '../jwt/roles.guard';
import { Roles } from '../jwt/roles.decorator';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Ambil semua produk' }) 
  
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAll(
  @Query('category') category?: string,
  @Query('search') search?: string,
) {
  return this.productsService.findAll(category, search);
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
    @Body() createProductDto: CreateProductDto, // Gunakan DTO yang sudah divalidasi
    @UploadedFile() file: Express.Multer.File,
  ) {
    let imageUrl: string | undefined;
    if (file) {
      imageUrl = await this.cloudinaryService.uploadImage(file);
    }

    // PENTING: Gunakan createProductDto, bukan 'body'
    // Kamu tidak perlu Number() manual lagi karena sudah di-handle @Transform di DTO
    return this.productsService.create({
      ...createProductDto,
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
  
@Put(':id/variants/:variantId')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiOperation({ summary: 'Update varian produk + foto (admin)' })
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      size: { type: 'string' },
      color: { type: 'string' },
      stock: { type: 'number' },
      image: { type: 'string', format: 'binary' },
    },
  },
})
@UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
async updateVariant(
  @Param('id') id: string,
  @Param('variantId') variantId: string,
  @Body() body: any,
  @UploadedFile() file: Express.Multer.File,
) {
  const data: any = { ...body };
  if (file) {
    data.imageUrl = await this.cloudinaryService.uploadImage(file);
  }
  if (body.stock) data.stock = Number(body.stock);
  return this.productsService.updateVariant(+variantId, data);
}
}