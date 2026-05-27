import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtAuthModule } from '../jwt/jwt.module';


@Module({
  imports: [PrismaModule, JwtAuthModule],
  providers: [CartService],
  controllers: [CartController]
})
export class CartModule {}
