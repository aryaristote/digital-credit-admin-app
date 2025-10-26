import { Money } from '../value-objects/money.vo';
import { DomainEvent } from '../events/domain-event.base';

/**
 * Credit Request Aggregate Root
 * Manages credit request state and business rules
 */
export class CreditRequestAggregate {
  private _id: string;
  private _userId: string;
  private _requestedAmount: Money;
  private _approvedAmount: Money | null;
  private _totalRepaid: Money;
  private _interestRate: number;
  private _termMonths: number;
  private _status: CreditStatus;
  private _purpose: string | null;
  private _rejectionReason: string | null;
  private _approvedBy: string | null;
  private _approvedAt: Date | null;
  private _dueDate: Date | null;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _domainEvents: DomainEvent[] = [];

  constructor(
    id: string,
    userId: string,
    requestedAmount: Money,
    interestRate: number,
    termMonths: number,
    purpose?: string,
  ) {
    this._id = id;
    this._userId = userId;
    this._requestedAmount = requestedAmount;
    this._interestRate = interestRate;
    this._termMonths = termMonths;
    this._purpose = purpose || null;
    this._status = CreditStatus.PENDING;
    this._approvedAmount = null;
    this._totalRepaid = Money.fromPrimitive(0);
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

  get requestedAmount(): Money {
    return this._requestedAmount;
  }

  get approvedAmount(): Money | null {
    return this._approvedAmount;
  }

  get totalRepaid(): Money {
    return this._totalRepaid;
  }

  get interestRate(): number {
    return this._interestRate;
  }

  get termMonths(): number {
    return this._termMonths;
  }

  get status(): CreditStatus {
    return this._status;
  }

  get purpose(): string | null {
    return this._purpose;
  }

  get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }

  /**
   * Approve the credit request
   */
  approve(approvedBy: string, approvedAmount?: Money): void {
    if (this._status !== CreditStatus.PENDING) {
      throw new Error('Only pending credit requests can be approved');
    }

    this._approvedAmount = approvedAmount || this._requestedAmount;
    this._status = CreditStatus.ACTIVE;
    this._approvedBy = approvedBy;
    this._approvedAt = new Date();

    // Calculate due date
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + this._termMonths);
    this._dueDate = dueDate;

    this._updatedAt = new Date();
    this.addDomainEvent(new CreditRequestApprovedEvent(this._id, this._userId));
  }

  /**
   * Reject the credit request
   */
  reject(rejectedBy: string, reason: string): void {
    if (this._status !== CreditStatus.PENDING) {
      throw new Error('Only pending credit requests can be rejected');
    }

    if (!reason || reason.trim().length === 0) {
      throw new Error('Rejection reason is required');
    }

    this._status = CreditStatus.REJECTED;
    this._rejectionReason = reason.trim();
    this._approvedBy = rejectedBy;
    this._approvedAt = new Date();
    this._updatedAt = new Date();

    this.addDomainEvent(new CreditRequestRejectedEvent(this._id, this._userId, reason));
  }

  /**
   * Process a repayment
   */
  repay(amount: Money): void {
    if (this._status !== CreditStatus.ACTIVE) {
      throw new Error('Only active credit requests can be repaid');
    }

    const totalOwed = this.calculateTotalOwed();
    const remainingBalance = totalOwed.subtract(this._totalRepaid);

    if (amount.isGreaterThan(remainingBalance)) {
      throw new Error(
        `Repayment amount exceeds remaining balance of ${remainingBalance.toString()}`,
      );
    }

    this._totalRepaid = this._totalRepaid.add(amount);
    this._updatedAt = new Date();

    // Check if fully repaid
    const newRemainingBalance = totalOwed.subtract(this._totalRepaid);
    if (newRemainingBalance.amount <= 0) {
      this._status = CreditStatus.COMPLETED;
      this.addDomainEvent(new CreditRequestCompletedEvent(this._id, this._userId));
    } else {
      this.addDomainEvent(
        new CreditRepaymentProcessedEvent(this._id, this._userId, amount),
      );
    }
  }

  /**
   * Calculate total amount owed (principal + interest)
   */
  calculateTotalOwed(): Money {
    if (!this._approvedAmount) {
      return Money.fromPrimitive(0);
    }

    const interest = this._approvedAmount.multiply(this._interestRate / 100);
    return this._approvedAmount.add(interest);
  }

  /**
   * Calculate remaining balance
   */
  calculateRemainingBalance(): Money {
    const totalOwed = this.calculateTotalOwed();
    return totalOwed.subtract(this._totalRepaid);
  }

  /**
   * Check if credit is overdue
   */
  isOverdue(): boolean {
    if (!this._dueDate || this._status !== CreditStatus.ACTIVE) {
      return false;
    }
    return new Date() > this._dueDate;
  }

  /**
   * Check if user has active credit
   */
  isActive(): boolean {
    return this._status === CreditStatus.ACTIVE;
  }

  /**
   * Check if credit is completed
   */
  isCompleted(): boolean {
    return this._status === CreditStatus.COMPLETED;
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

export enum CreditStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DEFAULTED = 'defaulted',
}

// Domain Events
export class CreditRequestApprovedEvent extends DomainEvent {
  constructor(
    public readonly creditRequestId: string,
    public readonly userId: string,
  ) {
    super('CreditRequestApproved', new Date());
  }
}

export class CreditRequestRejectedEvent extends DomainEvent {
  constructor(
    public readonly creditRequestId: string,
    public readonly userId: string,
    public readonly reason: string,
  ) {
    super('CreditRequestRejected', new Date());
  }
}

export class CreditRepaymentProcessedEvent extends DomainEvent {
  constructor(
    public readonly creditRequestId: string,
    public readonly userId: string,
    public readonly amount: Money,
  ) {
    super('CreditRepaymentProcessed', new Date());
  }
}

export class CreditRequestCompletedEvent extends DomainEvent {
  constructor(
    public readonly creditRequestId: string,
    public readonly userId: string,
  ) {
    super('CreditRequestCompleted', new Date());
  }
}
