import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { Roles } from 'src/jwt/roles.decorator';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { RolesGuard } from 'src/jwt/roles.guard';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')

@UseGuards(JwtAuthGuard, RolesGuard) 
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @Roles('USER') // Cuma User yang bisa lihat keranjang
  @ApiOperation({ summary: 'Lihat isi keranjang' })
  getCart(@Request() req: any) {
    return this.cartService.getCart(req.user.userId);
  }

  @Post('items')
  @Roles('USER') // Cuma User yang bisa tambah barang
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
  addItem(@Request() req: any, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(req.user.userId, dto);
  }

  @Patch('items/:id')
  @Roles('USER') // Cuma User yang bisa edit jumlah
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
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(+id, req.user.userId, dto.quantity);
  }

  @Delete('items/:id')
  @Roles('USER') // Cuma User yang bisa hapus item
  @ApiOperation({ summary: 'Hapus item dari keranjang' })
  removeItem(@Request() req: any, @Param('id') id: string) {
    return this.cartService.removeItem(+id, req.user.userId);
  }
}