import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Min} from 'class-validator';
import { Transform } from "class-transformer";

export class AddCartItemDto {
  @ApiProperty({ example: 1 })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  productId!: number;

  @ApiProperty({ example: 1 })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  quantity!: number;

  @ApiProperty({ example: 'M' })
  @IsNotEmpty()
  @IsString()
  size!: string;

  @ApiProperty({ example: 'Black' })
  @IsNotEmpty()
  @IsString()
  color!: string;
}