import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtAuthModule } from '../jwt/jwt.module';
import { CloudinaryModule } from 'cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, JwtAuthModule, CloudinaryModule],
  providers: [OrdersService],
  controllers: [OrdersController]
})
export class OrdersModule {}
