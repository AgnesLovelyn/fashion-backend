import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtAuthModule } from '../jwt/jwt.module';
import { CloudinaryModule } from 'cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, JwtAuthModule, CloudinaryModule],
  providers: [ProductsService],
  controllers: [ProductsController]
})
export class ProductsModule {}
