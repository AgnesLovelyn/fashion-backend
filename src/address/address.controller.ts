import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AddressService } from './address.service';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Address')
@ApiBearerAuth()
@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  @ApiOperation({ summary: 'Lihat semua alamat user' })
  findAll(@Request() req: any) {
    return this.addressService.findAll(req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Tambah alamat baru' })
  @ApiBody({
    schema: {
      example: {
        label: 'Rumah',
        street: 'Jl. Soekarno Hatta No. 1',
        city: 'Malang',
        province: 'Jawa Timur',
        postalCode: '65141',
      },
    },
  })
  create(
    @Request() req: any,
    @Body() body: {
      label: string;
      street: string;
      city: string;
      province: string;
      postalCode: string;
    },
  ) {
    return this.addressService.create(req.user.userId, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus alamat' })
  remove(@Request() req: any, @Param('id') id: string) {
    return this.addressService.remove(+id, req.user.userId);
  }
}