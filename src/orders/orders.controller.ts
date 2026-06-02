import { Controller, Get, Post, Body, Patch, UseGuards, Request, Param, UseInterceptors, UploadedFile, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { RolesGuard } from '../jwt/roles.guard';
import { Roles } from '../jwt/roles.decorator';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

@Post()
@UseGuards(RolesGuard)
@Roles('USER')
@ApiOperation({ summary: 'Buat order baru + Upload Bukti QRIS' })
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
      type: 'object',
      properties: {
        image: { // Untuk upload file bukti bayar
          type: 'string',
          format: 'binary',
        },
        data: { // Untuk data order (JSON string)
          type: 'string',
          description: 'JSON string dari CreateOrderDto',
          example: '{"addressId": 1, "items": [{"variantId": 1, "quantity": 2}]}',
        },
      },
    },
})
@UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
async createOrder(
  @Request() req: any,
  @Body('data') dataString: string,
  @UploadedFile() file: Express.Multer.File,
) {
  if (!dataString) {
    throw new BadRequestException('Data order tidak boleh kosong');
  }
  let dto: CreateOrderDto;
  try {
    dto = JSON.parse(dataString);
  } catch (error) {
    throw new BadRequestException('Format data JSON tidak valid');
  }
  return this.ordersService.createOrder(
    req.user.userId,
    dto,
    file,
  );
}

  @Get('my')
  @UseGuards(RolesGuard)
  @Roles('USER')
  @ApiOperation({ summary: 'Lihat riwayat order saya (User)' })
  findMyOrders(@Request() req: any) {
    return this.ordersService.findMyOrders(req.user.userId);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Lihat semua order masuk (Admin)' })
  findAll() {
    return this.ordersService.findAll();
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Verifikasi Pembayaran & Potong Stok (Admin)' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number, // Mengubah id string jadi number secara otomatis
    @Body() dto: UpdateStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto.status);
  }
}