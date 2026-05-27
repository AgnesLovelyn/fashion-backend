import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtAuthModule } from '../jwt/jwt.module';

@Module({
  imports: [PrismaModule, JwtAuthModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}