/**
 * Credit Score Value Object
 * Represents a credit score with validation
 * Score range: 300-850
 */
export class CreditScore {
  private readonly _score: number;
  private readonly _minScore = 300;
  private readonly _maxScore = 850;

  constructor(score: number) {
    if (score < this._minScore || score > this._maxScore) {
      throw new Error(
        `Credit score must be between ${this._minScore} and ${this._maxScore}`,
      );
    }
    this._score = Math.round(score);
  }

  get score(): number {
    return this._score;
  }

  /**
   * Get credit score category
   */
  getCategory(): CreditScoreCategory {
    if (this._score >= 750) return CreditScoreCategory.EXCELLENT;
    if (this._score >= 700) return CreditScoreCategory.GOOD;
    if (this._score >= 650) return CreditScoreCategory.FAIR;
    if (this._score >= 600) return CreditScoreCategory.POOR;
    return CreditScoreCategory.VERY_POOR;
  }

  /**
   * Check if score meets minimum threshold
   */
  meetsThreshold(threshold: number): boolean {
    return this._score >= threshold;
  }

  /**
   * Check if score is excellent
   */
  isExcellent(): boolean {
    return this._score >= 750;
  }

  /**
   * Check if score is good
   */
  isGood(): boolean {
    return this._score >= 700 && this._score < 750;
  }

  /**
   * Check if score is fair
   */
  isFair(): boolean {
    return this._score >= 650 && this._score < 700;
  }

  /**
   * Check if score is poor
   */
  isPoor(): boolean {
    return this._score >= 600 && this._score < 650;
  }

  /**
   * Check if score is very poor
   */
  isVeryPoor(): boolean {
    return this._score < 600;
  }

  equals(other: CreditScore): boolean {
    return this._score === other._score;
  }

  /**
   * Calculate interest rate based on credit score
   */
  calculateInterestRate(): number {
    if (this._score >= 750) return 5.0; // Excellent
    if (this._score >= 700) return 7.5; // Good
    if (this._score >= 650) return 10.0; // Fair
    if (this._score >= 600) return 15.0; // Poor
    return 20.0; // Very poor
  }

  /**
   * Convert to primitive for database storage
   */
  toPrimitive(): number {
    return this._score;
  }

  /**
   * Create from primitive (database value)
   */
  static fromPrimitive(score: number): CreditScore {
    return new CreditScore(score);
  }
}

export enum CreditScoreCategory {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  VERY_POOR = 'very_poor',
}
