import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { RolesGuard } from '../jwt/roles.guard';
import { Roles } from '../jwt/roles.decorator';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Buat order baru' })
  @ApiBody({
    schema: {
      example: {
        addressId: 1,
        cartItemIds: [1, 2],
      },
    },
  })
  createOrder(
    @Request() req: any,
    @Body() body: { addressId: number; cartItemIds: number[] },
  ) {
    return this.ordersService.createOrder(
      req.user.userId,
      body.addressId,
      body.cartItemIds,
    );
  }

  @Get('my')
  @ApiOperation({ summary: 'Lihat order milik user sendiri' })
  findMyOrders(@Request() req: any) {
    return this.ordersService.findMyOrders(req.user.userId);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Lihat semua order (admin)' })
  findAll() {
    return this.ordersService.findAll();
  }
}