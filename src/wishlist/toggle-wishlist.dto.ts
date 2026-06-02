import { IsNotEmpty, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class toggleWishlistDto {
    @ApiProperty({ example: 1, description: 'ID produk yang akan di-toggle'})
    @IsNotEmpty()
    @IsNumber()
    productId!: number;


}