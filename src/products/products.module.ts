import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtAuthModule } from '../jwt/jwt.module';

@Module({
  imports: [PrismaModule, JwtAuthModule],
  providers: [ProductsService],
  controllers: [ProductsController]
})
export class ProductsModule {}
