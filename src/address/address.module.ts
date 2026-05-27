import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtAuthModule } from '../jwt/jwt.module';

@Module({
  imports: [PrismaModule, JwtAuthModule],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}