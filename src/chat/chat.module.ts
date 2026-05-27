import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtAuthModule } from '../jwt/jwt.module';

@Module({
  imports: [PrismaModule, JwtAuthModule],
  providers: [ChatService],
  controllers: [ChatController]
})
export class ChatModule {}
