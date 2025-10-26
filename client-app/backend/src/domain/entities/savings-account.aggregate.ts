import { Money } from '../value-objects/money.vo';
import { AccountNumber } from '../value-objects/account-number.vo';
import { DomainEvent } from '../events/domain-event.base';

/**
 * Savings Account Aggregate Root
 * Manages savings account state and business rules
 */
export class SavingsAccountAggregate {
  private _id: string;
  private _userId: string;
  private _accountNumber: AccountNumber;
  private _balance: Money;
  private _interestRate: number;
  private _status: AccountStatus;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _domainEvents: DomainEvent[] = [];

  constructor(
    id: string,
    userId: string,
    accountNumber: AccountNumber,
    initialBalance: Money = Money.fromPrimitive(0),
    interestRate: number = 2.5,
  ) {
    this._id = id;
    this._userId = userId;
    this._accountNumber = accountNumber;
    this._balance = initialBalance;
    this._interestRate = interestRate;
    this._status = AccountStatus.ACTIVE;
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get accountNumber(): AccountNumber {
    return this._accountNumber;
  }

  get balance(): Money {
    return this._balance;
  }

  get interestRate(): number {
    return this._interestRate;
  }

  get status(): AccountStatus {
    return this._status;
  }

  get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }

  /**
   * Deposit money into account
   */
  deposit(amount: Money): void {
    if (this._status !== AccountStatus.ACTIVE) {
      throw new Error('Account is not active');
    }

    if (amount.amount <= 0) {
      throw new Error('Deposit amount must be greater than 0');
    }

    this._balance = this._balance.add(amount);
    this._updatedAt = new Date();

    this.addDomainEvent(new SavingsDepositedEvent(this._id, this._userId, amount));
  }

  /**
   * Withdraw money from account
   */
  withdraw(amount: Money): void {
    if (this._status !== AccountStatus.ACTIVE) {
      throw new Error('Account is not active');
    }

    if (amount.amount <= 0) {
      throw new Error('Withdrawal amount must be greater than 0');
    }

    if (amount.isGreaterThan(this._balance)) {
      throw new Error(
        `Insufficient funds. Available: ${this._balance.toString()}, Requested: ${amount.toString()}`,
      );
    }

    this._balance = this._balance.subtract(amount);
    this._updatedAt = new Date();

    this.addDomainEvent(new SavingsWithdrawnEvent(this._id, this._userId, amount));
  }

  /**
   * Check if account has sufficient balance
   */
  hasSufficientBalance(amount: Money): boolean {
    return this._balance.isGreaterThan(amount) || this._balance.equals(amount);
  }

  /**
   * Freeze account
   */
  freeze(): void {
    if (this._status === AccountStatus.FROZEN) {
      throw new Error('Account is already frozen');
    }

    this._status = AccountStatus.FROZEN;
    this._updatedAt = new Date();

    this.addDomainEvent(new AccountFrozenEvent(this._id, this._userId));
  }

  /**
   * Unfreeze account
   */
  unfreeze(): void {
    if (this._status !== AccountStatus.FROZEN) {
      throw new Error('Account is not frozen');
    }

    this._status = AccountStatus.ACTIVE;
    this._updatedAt = new Date();

    this.addDomainEvent(new AccountUnfrozenEvent(this._id, this._userId));
  }

  /**
   * Close account
   */
  close(): void {
    if (this._balance.amount > 0) {
      throw new Error('Cannot close account with balance');
    }

    this._status = AccountStatus.CLOSED;
    this._updatedAt = new Date();

    this.addDomainEvent(new AccountClosedEvent(this._id, this._userId));
  }

  /**
   * Calculate interest for a period
   */
  calculateInterest(months: number): Money {
    const annualInterest = this._balance.multiply(this._interestRate / 100);
    const monthlyInterest = annualInterest.multiply(months / 12);
    return monthlyInterest;
  }

  /**
   * Add domain event
   */
  private addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  /**
   * Clear domain events (after they've been handled)
   */
  clearDomainEvents(): void {
    this._domainEvents = [];
  }
}

export enum AccountStatus {
  ACTIVE = 'active',
  FROZEN = 'frozen',
  CLOSED = 'closed',
}

// Domain Events
export class SavingsDepositedEvent extends DomainEvent {
  constructor(
    public readonly accountId: string,
    public readonly userId: string,
    public readonly amount: Money,
  ) {
    super('SavingsDeposited', new Date());
  }
}

export class SavingsWithdrawnEvent extends DomainEvent {
  constructor(
    public readonly accountId: string,
    public readonly userId: string,
    public readonly amount: Money,
  ) {
    super('SavingsWithdrawn', new Date());
  }
}

export class AccountFrozenEvent extends DomainEvent {
  constructor(
    public readonly accountId: string,
    public readonly userId: string,
  ) {
    super('AccountFrozen', new Date());
  }
}

export class AccountUnfrozenEvent extends DomainEvent {
  constructor(
    public readonly accountId: string,
    public readonly userId: string,
  ) {
    super('AccountUnfrozen', new Date());
  }
}

export class AccountClosedEvent extends DomainEvent {
  constructor(
    public readonly accountId: string,
    public readonly userId: string,
  ) {
    super('AccountClosed', new Date());
  }
}
