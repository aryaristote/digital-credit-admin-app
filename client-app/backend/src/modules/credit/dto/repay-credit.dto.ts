import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, IsOptional, IsString } from 'class-validator';

export class RepayCreditDto {
  @ApiProperty({
    example: 500,
    description: 'Repayment amount',
  })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({
    example: 'Monthly payment',
    description: 'Repayment notes',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

