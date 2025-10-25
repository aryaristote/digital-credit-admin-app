import { ApiProperty } from '@nestjs/swagger';
import { CreditStatus } from '../entities/credit-request.entity';

export class CreditRequestResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  requestedAmount: number;

  @ApiProperty()
  approvedAmount: number;

  @ApiProperty()
  totalRepaid: number;

  @ApiProperty()
  interestRate: number;

  @ApiProperty()
  termMonths: number;

  @ApiProperty({ enum: CreditStatus })
  status: CreditStatus;

  @ApiProperty()
  purpose: string;

  @ApiProperty()
  rejectionReason: string;

  @ApiProperty()
  approvedBy: string;

  @ApiProperty()
  approvedAt: Date;

  @ApiProperty()
  dueDate: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

