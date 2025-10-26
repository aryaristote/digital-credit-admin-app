/**
 * Money Value Object
 * Represents a monetary amount with currency
 * Immutable - cannot be changed once created
 */
export class Money {
  private readonly _amount: number;
  private readonly _currency: string;

  constructor(amount: number, currency: string = 'USD') {
    if (amount < 0) {
      throw new Error('Money amount cannot be negative');
    }
    this._amount = Number(amount.toFixed(2));
    this._currency = currency;
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): string {
    return this._currency;
  }

  /**
   * Add two money amounts (must be same currency)
   */
  add(other: Money): Money {
    if (this._currency !== other._currency) {
      throw new Error('Cannot add money with different currencies');
    }
    return new Money(this._amount + other._amount, this._currency);
  }

  /**
   * Subtract two money amounts (must be same currency)
   */
  subtract(other: Money): Money {
    if (this._currency !== other._currency) {
      throw new Error('Cannot subtract money with different currencies');
    }
    const result = this._amount - other._amount;
    if (result < 0) {
      throw new Error('Insufficient funds');
    }
    return new Money(result, this._currency);
  }

  /**
   * Multiply money by a factor
   */
  multiply(factor: number): Money {
    return new Money(this._amount * factor, this._currency);
  }

  /**
   * Check if this money is greater than other
   */
  isGreaterThan(other: Money): boolean {
    if (this._currency !== other._currency) {
      throw new Error('Cannot compare money with different currencies');
    }
    return this._amount > other._amount;
  }

  /**
   * Check if this money is less than other
   */
  isLessThan(other: Money): boolean {
    if (this._currency !== other._currency) {
      throw new Error('Cannot compare money with different currencies');
    }
    return this._amount < other._amount;
  }

  /**
   * Check if this money equals other
   */
  equals(other: Money): boolean {
    return this._amount === other._amount && this._currency === other._currency;
  }

  /**
   * Convert to primitive for database storage
   */
  toPrimitive(): number {
    return this._amount;
  }

  /**
   * Create from primitive (database value)
   */
  static fromPrimitive(amount: number, currency: string = 'USD'): Money {
    return new Money(amount, currency);
  }

  toString(): string {
    return `${this._currency} ${this._amount.toFixed(2)}`;
  }
}
