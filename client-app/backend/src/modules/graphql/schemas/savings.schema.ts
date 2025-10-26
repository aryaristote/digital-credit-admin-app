import {
  Field,
  ObjectType,
  ID,
  InputType,
  Float,
  registerEnumType,
} from '@nestjs/graphql';

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  INTEREST = 'interest',
  FEE = 'fee',
}

registerEnumType(TransactionType, {
  name: 'TransactionType',
});

@ObjectType()
export class SavingsAccount {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  userId: string;

  @Field()
  accountNumber: string;

  @Field(() => Float)
  balance: number;

  @Field(() => Float)
  interestRate: number;

  @Field()
  status: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}

@ObjectType()
export class Transaction {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  savingsAccountId: string;

  @Field(() => TransactionType)
  type: TransactionType;

  @Field(() => Float)
  amount: number;

  @Field(() => Float)
  balanceAfter: number;

  @Field()
  status: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  reference?: string;

  @Field()
  createdAt: Date;
}

@InputType()
export class DepositInput {
  @Field(() => Float)
  amount: number;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class WithdrawInput {
  @Field(() => Float)
  amount: number;

  @Field({ nullable: true })
  description?: string;
}
