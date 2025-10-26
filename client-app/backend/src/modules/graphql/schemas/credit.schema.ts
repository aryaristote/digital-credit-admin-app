import {
  Field,
  ObjectType,
  ID,
  InputType,
  Float,
  Int,
  registerEnumType,
} from '@nestjs/graphql';

export enum CreditStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DEFAULTED = 'defaulted',
}

registerEnumType(CreditStatus, {
  name: 'CreditStatus',
});

@ObjectType()
export class CreditRequest {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  userId: string;

  @Field(() => Float)
  requestedAmount: number;

  @Field(() => Float, { nullable: true })
  approvedAmount?: number;

  @Field(() => Float)
  totalRepaid: number;

  @Field(() => Float)
  interestRate: number;

  @Field(() => Int)
  termMonths: number;

  @Field(() => CreditStatus)
  status: CreditStatus;

  @Field({ nullable: true })
  purpose?: string;

  @Field({ nullable: true })
  rejectionReason?: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}

@InputType()
export class CreateCreditRequestInput {
  @Field(() => Float)
  requestedAmount: number;

  @Field(() => Int)
  termMonths: number;

  @Field({ nullable: true })
  purpose?: string;
}

@InputType()
export class RepayCreditInput {
  @Field(() => Float)
  amount: number;
}
