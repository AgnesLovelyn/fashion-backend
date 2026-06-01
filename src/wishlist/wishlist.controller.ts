import { Controller, Get, Post, Body, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Wishlist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
    constructor(private readonly wishlistService: WishlistService) {}

        @Post('toggle')
        @ApiOperation({ summary: 'Tambah atau hapus dari wishlist'})
        async toggle(@Req() req: any, @Body('productId', ParseIntPipe) productId: number){
            const userId = req.user.userId;
            return this.wishlistService.toggleWishlist(userId, productId);
        }
        @Get()
        @ApiOperation({ summary: 'Melihat semua daftar wishlist saya' })
        async findAll(@Req() req: any) {
        const userId = req.user.userId;
        return this.wishlistService.getMyWishlist(userId);
    }
}
