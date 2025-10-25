import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, IsOptional, IsString } from 'class-validator';

export class DepositDto {
  @ApiProperty({
    example: 100,
    description: 'Amount to deposit',
  })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({
    example: 'Monthly savings',
    description: 'Transaction description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}

