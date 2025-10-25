import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, IsOptional, IsString } from 'class-validator';

export class WithdrawDto {
  @ApiProperty({
    example: 50,
    description: 'Amount to withdraw',
  })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({
    example: 'Emergency withdrawal',
    description: 'Transaction description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}

