import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { RolesGuard } from '../jwt/roles.guard';
import { Roles } from '../jwt/roles.decorator';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Ambil semua kategori' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil kategori by ID' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Tambah kategori baru (admin)' })
  @ApiBody({
    schema: {
      example: {
        name: 'Baju',
        slug: 'baju',
      },
    },
  })
  create(@Body() body: { name: string; slug: string }) {
    return this.categoriesService.create(body);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update kategori (admin)' })
  @ApiBody({
    schema: {
      example: {
        name: 'Baju Updated',
        slug: 'baju-updated',
      },
    },
  })
  update(@Param('id') id: string, @Body() body: Partial<{ name: string; slug: string }>) {
    return this.categoriesService.update(+id, body);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Hapus kategori (admin)' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}