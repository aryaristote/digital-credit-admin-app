import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class CreateSavingsAccountDto {
  @ApiProperty({
    example: 100,
    description: 'Initial deposit amount',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  initialDeposit?: number;
}

