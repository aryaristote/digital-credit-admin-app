import { ApiProperty } from '@nestjs/swagger';
import { RepaymentStatus } from '../entities/credit-repayment.entity';

export class CreditRepaymentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  creditRequestId: string;

  @ApiProperty()
  amount: number;

  @ApiProperty({ enum: RepaymentStatus })
  status: RepaymentStatus;

  @ApiProperty()
  reference: string;

  @ApiProperty()
  notes: string;

  @ApiProperty()
  createdAt: Date;
}

