import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max, IsString, IsOptional } from 'class-validator';

export class CreateCreditRequestDto {
  @ApiProperty({
    example: 5000,
    description: 'Requested loan amount',
  })
  @IsNumber()
  @Min(100)
  @Max(100000)
  requestedAmount: number;

  @ApiProperty({
    example: 12,
    description: 'Loan term in months',
  })
  @IsNumber()
  @Min(1)
  @Max(60)
  termMonths: number;

  @ApiProperty({
    example: 'Home renovation',
    description: 'Purpose of the loan',
    required: false,
  })
  @IsOptional()
  @IsString()
  purpose?: string;
}

