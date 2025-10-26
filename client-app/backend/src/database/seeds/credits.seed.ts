import { DataSource } from 'typeorm';
import {
  CreditRequest,
  CreditStatus,
} from '../../modules/credit/entities/credit-request.entity';
import {
  CreditRepayment,
  RepaymentStatus,
} from '../../modules/credit/entities/credit-repayment.entity';
import { User } from '../../modules/users/entities/user.entity';

export async function seedCredits(dataSource: DataSource): Promise<void> {
  const creditRepository = dataSource.getRepository(CreditRequest);
  const repaymentRepository = dataSource.getRepository(CreditRepayment);
  const userRepository = dataSource.getRepository(User);

  // Get users with good credit scores
  const users = await userRepository.find({
    where: { creditScore: 700 },
    take: 2,
  });

  if (users.length === 0) {
    console.log('No eligible users found, skipping credit seed...');
    return;
  }

  // Create sample credit requests
  const creditRequests = [
    {
      userId: users[0].id,
      requestedAmount: 10000,
      approvedAmount: 10000,
      totalRepaid: 3000,
      interestRate: 7.5,
      termMonths: 12,
      status: CreditStatus.ACTIVE,
      purpose: 'Home improvement',
      approvedBy: 'admin-001',
      approvedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      dueDate: new Date(Date.now() + 11 * 30 * 24 * 60 * 60 * 1000), // 11 months from now
    },
    {
      userId: users[0].id,
      requestedAmount: 5000,
      approvedAmount: 5000,
      totalRepaid: 5000,
      interestRate: 10.0,
      termMonths: 6,
      status: CreditStatus.COMPLETED,
      purpose: 'Emergency expenses',
      approvedBy: 'admin-001',
      approvedAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000), // 200 days ago
      dueDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
    },
    {
      userId: users.length > 1 ? users[1].id : users[0].id,
      requestedAmount: 15000,
      approvedAmount: null,
      totalRepaid: 0,
      interestRate: 15.0,
      termMonths: 24,
      status: CreditStatus.PENDING,
      purpose: 'Business expansion',
    },
  ];

  const savedCredits = await creditRepository.save(creditRequests);

  // Create sample repayments for active credit
  const activeCredit = savedCredits.find((c) => c.status === CreditStatus.ACTIVE);
  if (activeCredit) {
    const repayments = [
      {
        creditRequestId: activeCredit.id,
        amount: 1000,
        status: RepaymentStatus.COMPLETED,
        reference: `REP-${activeCredit.id.slice(0, 8)}-1`,
        notes: 'First monthly payment',
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      },
      {
        creditRequestId: activeCredit.id,
        amount: 1000,
        status: RepaymentStatus.COMPLETED,
        reference: `REP-${activeCredit.id.slice(0, 8)}-2`,
        notes: 'Second monthly payment',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      },
      {
        creditRequestId: activeCredit.id,
        amount: 1000,
        status: RepaymentStatus.COMPLETED,
        reference: `REP-${activeCredit.id.slice(0, 8)}-3`,
        notes: 'Third monthly payment',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
    ];

    await repaymentRepository.save(repayments);
    console.log(`✅ Created ${repayments.length} repayments for active credit`);
  }

  console.log(`✅ Seeded ${savedCredits.length} credit requests`);
}
