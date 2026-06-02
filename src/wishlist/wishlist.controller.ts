import { Controller, Get, Post, Body, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/jwt/roles.decorator';
import { RolesGuard } from 'src/jwt/roles.guard';
import { toggleWishlistDto } from './toggle-wishlist.dto';

@ApiTags('Wishlist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('wishlist')
export class WishlistController {
    constructor(private readonly wishlistService: WishlistService) {}

        @Post('toggle')
        @Roles('USER')
        @ApiOperation({ summary: 'Tambah atau hapus dari wishlist'})
        async toggle(@Req() req: any, @Body() dto: toggleWishlistDto){
            return this.wishlistService.toggleWishlist(req.user.userId, dto.productId);
        }
        @Get()
        @Roles('USER')
        @ApiOperation({ summary: 'Melihat semua daftar wishlist saya' })
        async findAll(@Req() req: any) {
        const userId = req.user.userId;
        return this.wishlistService.getMyWishlist(req.user.userId);
    }
}
