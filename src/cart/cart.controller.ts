import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Lihat isi keranjang' })
  getCart(@Request() req: any) {
    return this.cartService.getCart(req.user.userId);
  }

  @Post('items')
  @ApiOperation({ summary: 'Tambah item ke keranjang' })
  @ApiBody({
    schema: {
      example: {
        productId: 1,
        quantity: 2,
        size: 'M',
        color: 'Black',
      },
    },
  })
  addItem(@Request() req: any, @Body() body: {
    productId: number;
    quantity: number;
    size: string;
    color: string;
  }) {
    return this.cartService.addItem(req.user.userId, body);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Update quantity item keranjang' })
  @ApiBody({
    schema: {
      example: {
        quantity: 3,
      },
    },
  })
  updateItem(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { quantity: number },
  ) {
    return this.cartService.updateItem(+id, req.user.userId, body.quantity);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Hapus item dari keranjang' })
  removeItem(@Request() req: any, @Param('id') id: string) {
    return this.cartService.removeItem(+id, req.user.userId);
  }
}