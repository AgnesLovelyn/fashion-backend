import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { RolesGuard } from '../jwt/roles.guard';
import { Roles } from '../jwt/roles.decorator';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Chat')
@ApiBearerAuth()
@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

   // User kirim pesan ke admin
  @Post('send')
  @ApiOperation({ summary: 'User kirim pesan ke admin (bisa terikat ke produk)' })
  @ApiBody({
    schema: {
      example: {
        content: 'Halo admin, apakah hoodie zipper ini tersedia ukuran XL?',
        productId:2,

      },
    },
  })
  sendMessage(
    @Request() req: any,
    @Body() body: { content: string; productId?: number },
  ) {
    return this.chatService.sendMessage(req.user.userId, body.content, body.productId,);
  }

  // User lihat percakapannya sendiri (bisa filter by produk)
  @Get('my')
  @ApiOperation({ summary: 'User lihat pesannya sendiri, bisa filter by productId' })
  getMyMessages(
    @Request() req: any,
    @Query('productId') productId?: string,
  ) {
    return this.chatService.getMyMessages(
      req.user.userId,
      productId ? +productId : undefined,
    );
  }

// Admin lihat semua percakapan (bisa filter by produk)
  @Get('all')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Admin lihat semua pesan, bisa filter by productId' })
  getAllMessages(@Query('productId') productId?: string) {
    return this.chatService.getAllMessages(
      productId ? +productId : undefined,
    );
  }

  // Admin lihat percakapan dengan user tertentu (bisa filter by produk)
  @Get('user/:userId')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Admin lihat percakapan user tertentu, bisa filter by productId' })
  getMessagesByUser(
    @Param('userId') userId: string,
    @Query('productId') productId?: string,
  ) {
    return this.chatService.getMessagesByUser(
      +userId,
      productId ? +productId : undefined,
    );
  }

 // Admin balas pesan ke user tertentu
  @Post('reply/:userId')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Admin balas pesan user, bisa terikat ke produk' })
  @ApiBody({
    schema: {
      example: {
        content: 'Untuk ukuran XL stok masih tersedia ya!',
        productId: 2,
      },
    },
  })
  replyMessage(
    @Param('userId') userId: string,
    @Body() body: { content: string; productId?: number },
  ) {return this.chatService.replyMessage(+userId, body.content, body.productId,
  );
  }
}