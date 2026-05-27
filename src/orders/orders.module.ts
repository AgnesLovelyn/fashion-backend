import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtAuthModule } from 'src/jwt/jwt.module';

@Module({
  imports: [PrismaModule, JwtAuthModule],
  providers: [OrdersService],
  controllers: [OrdersController]
})
export class OrdersModule {}
