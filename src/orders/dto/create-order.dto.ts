import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, ArrayMinSize } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateOrderDto {
  @ApiProperty({ example: 1 })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  addressId!: number;

  @ApiProperty({ example: [1, 2] })
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  cartItemIds!: number[];
}