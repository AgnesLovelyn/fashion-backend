import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: ' Ina Sakinah' })
  @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'Ina@gmail.com' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  email!: string;

  @ApiProperty({ example: '12345' })
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password!: string;
}