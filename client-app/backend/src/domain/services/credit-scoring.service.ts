import { CreditScore } from '../value-objects/credit-score.vo';

/**
 * Domain Service: Credit Scoring
 * Handles credit score calculations and validations
 */
export class CreditScoringService {
  private readonly MIN_CREDIT_SCORE = 600;
  private readonly EXCELLENT_THRESHOLD = 750;
  private readonly GOOD_THRESHOLD = 700;

  /**
   * Validate if credit score meets minimum requirement
   */
  meetsMinimumRequirement(creditScore: CreditScore): boolean {
    return creditScore.meetsThreshold(this.MIN_CREDIT_SCORE);
  }

  /**
   * Determine if automatic approval should be granted
   */
  shouldAutoApprove(creditScore: CreditScore): boolean {
    return creditScore.meetsThreshold(this.EXCELLENT_THRESHOLD);
  }

  /**
   * Calculate financial health component from credit score
   */
  calculateHealthComponent(creditScore: CreditScore): number {
    // Normalize credit score (300-850) to 0-100
    const score = creditScore.score;
    return Math.max(0, Math.min(100, ((score - 300) / 550) * 100));
  }

  /**
   * Get credit improvement recommendations
   */
  getImprovementRecommendations(creditScore: CreditScore): string[] {
    const recommendations: string[] = [];

    if (creditScore.isVeryPoor() || creditScore.isPoor()) {
      recommendations.push('Make timely payments on all debts');
      recommendations.push('Keep credit utilization below 30%');
      recommendations.push('Avoid opening new credit accounts');
    } else if (creditScore.isFair()) {
      recommendations.push('Continue making on-time payments');
      recommendations.push('Reduce outstanding debt balances');
    } else if (creditScore.isGood()) {
      recommendations.push('Maintain good payment history');
      recommendations.push('Keep accounts in good standing');
    }

    return recommendations;
  }
}
