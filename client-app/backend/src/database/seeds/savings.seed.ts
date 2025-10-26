import { DataSource } from 'typeorm';
import { SavingsAccount } from '../../modules/savings/entities/savings-account.entity';
import {
  Transaction,
  TransactionType,
  TransactionStatus,
} from '../../modules/savings/entities/transaction.entity';
import { User } from '../../modules/users/entities/user.entity';

export async function seedSavings(dataSource: DataSource): Promise<void> {
  const savingsRepository = dataSource.getRepository(SavingsAccount);
  const transactionRepository = dataSource.getRepository(Transaction);
  const userRepository = dataSource.getRepository(User);

  // Get existing users
  const users = await userRepository.find();

  if (users.length === 0) {
    console.log('No users found, skipping savings seed...');
    return;
  }

  // Create savings accounts for each user
  for (const user of users) {
    const existingAccount = await savingsRepository.findOne({
      where: { userId: user.id },
    });

    if (existingAccount) {
      console.log(`Savings account already exists for user ${user.email}`);
      continue;
    }

    // Generate account number
    const accountNumber = `SAV${Date.now().toString().slice(-8)}${Math.floor(
      Math.random() * 10000,
    )
      .toString()
      .padStart(4, '0')}`;

    const savingsAccount = savingsRepository.create({
      userId: user.id,
      accountNumber,
      balance: Math.floor(Math.random() * 10000) + 1000, // Random balance between 1000-11000
      interestRate: 2.5,
      status: 'active',
    });

    const savedAccount = await savingsRepository.save(savingsAccount);

    // Create initial deposit transaction
    const initialDeposit = transactionRepository.create({
      savingsAccountId: savedAccount.id,
      type: TransactionType.DEPOSIT,
      amount: savedAccount.balance,
      balanceAfter: savedAccount.balance,
      status: TransactionStatus.COMPLETED,
      description: 'Initial account deposit',
      reference: `INIT-${savedAccount.id.slice(0, 8)}`,
    });

    await transactionRepository.save(initialDeposit);
    console.log(`✅ Created savings account for ${user.email}`);
  }
}
