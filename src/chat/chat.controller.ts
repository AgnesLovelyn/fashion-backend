import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
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

  @Post('send')
  @ApiOperation({ summary: 'User kirim pesan ke admin' })
  @ApiBody({
    schema: {
      example: {
        content: 'Halo admin, apakah hoodie zipper tersedia ukuran XL?',
      },
    },
  })
  sendMessage(
    @Request() req: any,
    @Body() body: { content: string },
  ) {
    return this.chatService.sendMessage(req.user.userId, body.content);
  }

  @Get('my')
  @ApiOperation({ summary: 'User lihat percakapannya sendiri' })
  getMyMessages(@Request() req: any) {
    return this.chatService.getMyMessages(req.user.userId);
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Admin lihat semua percakapan' })
  getAllMessages() {
    return this.chatService.getAllMessages();
  }

  @Get('user/:userId')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Admin lihat percakapan user tertentu' })
  getMessagesByUser(@Param('userId') userId: string) {
    return this.chatService.getMessagesByUser(+userId);
  }

  @Post('reply/:userId')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Admin balas pesan user' })
  @ApiBody({
    schema: {
      example: {
        content: 'Halo! Untuk ukuran XL stok masih tersedia ya!',
      },
    },
  })
  replyMessage(
    @Param('userId') userId: string,
    @Body() body: { content: string },
  ) {
    return this.chatService.replyMessage(+userId, body.content);
  }
}