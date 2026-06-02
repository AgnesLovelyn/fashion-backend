import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtAuthModule } from 'src/jwt/jwt.module';

@Module({
  imports: [PrismaModule, JwtAuthModule],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
