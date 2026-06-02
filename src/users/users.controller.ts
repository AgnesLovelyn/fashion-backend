import { Controller, Get, Delete, Patch, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { RolesGuard } from '../jwt/roles.guard';
import { Roles } from '../jwt/roles.decorator';
import {ApiTags, ApiOperation, ApiBearerAuth, ApiBody} from '@nestjs/swagger';
import { Role } from '@prisma/client';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) // Pasang Satpam & Pemeriksa Role di sini sekaligus
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Melihat profil user sendiri' })
  getProfile(@Request() req: any) {
    return this.usersService.getProfile(req.user.userId);
  }

  // --- ENDPOINT KHUSUS ADMIN ---
  // Sekarang di sini kamu cuma perlu tambah @Roles('ADMIN') saja

  @Get()
  @Roles('ADMIN') 
  @ApiOperation({ summary: 'Lihat semua user (Admin)' })
  findAll() {
    return this.usersService.findAll();
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Hapus user (Admin)' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.usersService.remove(id, req.user.userId);
  }

  @Patch(':id/role')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Ubah role user (Admin)' })
  @ApiBody({
    schema: {
      example: { role: 'ADMIN' },
      description: 'Pilihan role: USER atau ADMIN'
    }
  })
  updateRole(@Param('id', ParseIntPipe) id: number, @Body('role') role: Role) {
    return this.usersService.updateRole(id, role);
  }
}

