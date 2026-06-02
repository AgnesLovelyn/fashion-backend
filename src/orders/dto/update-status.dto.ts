import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UpdateStatusDto {
  @ApiProperty({ enum: ['PENDING', 'SUCCESS'], example: 'SUCCESS' })
  @IsEnum(['PENDING', 'SUCCESS'])
  status!: string;
}