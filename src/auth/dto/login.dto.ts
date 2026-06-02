import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'Ina@gmail.com' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  email!: string;

  @ApiProperty({ example: '12345' })
  @IsNotEmpty({ message: 'Password tidak    kosong' })
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password!: string;
}