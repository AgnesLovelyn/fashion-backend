import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, ArrayMinSize, IsNotEmpty } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateOrderDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNumber()
  addressId!: number;

  @ApiProperty({ 
    example: [35], 
    type: [Number],
    description: 'Array ID dari tabel CartItem' 
  })
  @Transform(({ value }) => {
    // Kalau value-nya dateng sebagai string "[35]" atau "35"
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed.map(Number) : [Number(parsed)];
      } catch {
        return value.split(',').map((id) => Number(id.trim()));
      }
    }
    return Array.isArray(value) ? value.map(Number) : [Number(value)];
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  cartItemIds!: number[];
}