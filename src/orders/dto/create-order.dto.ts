import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, ArrayMinSize, IsNotEmpty } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateOrderDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number) // Memastikan input diubah jadi number
  @IsNumber()
  addressId!: number;

  @ApiProperty({ 
    example: [1, 2], 
    type: [Number], // Memberitahu Swagger ini adalah Array of Number
    description: 'Array ID dari item di cart' 
  })
  @Transform(({ value }) => {
    // Trik ini supaya kalau dikirim string "1,2" atau "1" tetep jadi Array Number
    if (typeof value === 'string') {
      return value.split(',').map((id) => Number(id.trim()));
    }
    return Array.isArray(value) ? value.map(Number) : value;
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  cartItemIds!: number[];

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsNotEmpty()
  image: any; // Field untuk bukti transfer
}