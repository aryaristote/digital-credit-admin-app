import { ApiProperty } from '@nestjs/swagger';

export class SavingsAccountResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  accountNumber: string;

  @ApiProperty()
  balance: number;

  @ApiProperty()
  interestRate: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

