import { ApiProperty } from '@nestjs/swagger';
import { TransactionType, TransactionStatus } from '../entities/transaction.entity';

export class TransactionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  savingsAccountId: string;

  @ApiProperty({ enum: TransactionType })
  type: TransactionType;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  balanceAfter: number;

  @ApiProperty({ enum: TransactionStatus })
  status: TransactionStatus;

  @ApiProperty()
  description: string;

  @ApiProperty()
  reference: string;

  @ApiProperty()
  createdAt: Date;
}

