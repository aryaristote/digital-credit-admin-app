/**
 * Account Number Value Object
 * Represents a bank account number with validation
 */
export class AccountNumber {
  private readonly _value: string;
  private readonly _prefix: string;

  constructor(value: string, prefix: string = 'SAV') {
    if (!value || value.trim().length === 0) {
      throw new Error('Account number cannot be empty');
    }

    if (!value.startsWith(prefix)) {
      throw new Error(`Account number must start with ${prefix}`);
    }

    if (value.length < 8) {
      throw new Error('Account number must be at least 8 characters');
    }

    this._value = value;
    this._prefix = prefix;
  }

  get value(): string {
    return this._value;
  }

  get prefix(): string {
    return this._prefix;
  }

  equals(other: AccountNumber): boolean {
    return this._value === other._value;
  }

  /**
   * Generate a new account number
   */
  static generate(prefix: string = 'SAV'): AccountNumber {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    const value = `${prefix}${timestamp}${random}`;
    return new AccountNumber(value, prefix);
  }

  toString(): string {
    return this._value;
  }
}
