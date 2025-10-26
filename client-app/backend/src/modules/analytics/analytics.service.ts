import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreditRepository } from '../credit/credit.repository';
import { SavingsService } from '../savings/savings.service';
import { UsersService } from '../users/users.service';
import { CreditRequest, CreditStatus } from '../credit/entities/credit-request.entity';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    private readonly creditRepository: CreditRepository,
    private readonly savingsService: SavingsService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Calculate overall financial health score for a user
   * Score based on: credit score, savings ratio, debt-to-income, payment history
   */
  async getFinancialHealth(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get user's savings account
    let savingsBalance = 0;
    try {
      const savingsAccount = await this.savingsService.getAccount(userId);
      savingsBalance = savingsAccount.balance;
    } catch (error) {
      // User may not have savings account yet
      this.logger.warn(`No savings account found for user ${userId}`);
    }

    // Get active credits
    const activeCredits = await this.creditRepository.findActiveByUserId(userId);
    const totalDebt = activeCredits.reduce((sum, credit) => {
      const principal = Number(credit.approvedAmount || 0);
      const interest = principal * (Number(credit.interestRate) / 100);
      const totalOwed = principal + interest;
      const repaid = Number(credit.totalRepaid || 0);
      return sum + (totalOwed - repaid);
    }, 0);

    // Calculate components
    const creditScoreComponent = this.calculateCreditScoreComponent(user.creditScore);
    const savingsComponent = this.calculateSavingsComponent(savingsBalance, totalDebt);
    const debtRatioComponent = this.calculateDebtRatioComponent(
      totalDebt,
      savingsBalance,
    );
    const paymentHistoryComponent = await this.calculatePaymentHistoryComponent(userId);

    // Weighted average
    const financialHealthScore = Math.round(
      creditScoreComponent * 0.35 +
        savingsComponent * 0.25 +
        debtRatioComponent * 0.25 +
        paymentHistoryComponent * 0.15,
    );

    // Get health status
    const healthStatus = this.getHealthStatus(financialHealthScore);

    // Recommendations
    const recommendations = this.generateRecommendations(
      user.creditScore,
      savingsBalance,
      totalDebt,
      financialHealthScore,
    );

    return {
      financialHealthScore,
      healthStatus,
      components: {
        creditScore: {
          score: creditScoreComponent,
          value: user.creditScore,
          max: 850,
        },
        savings: {
          score: savingsComponent,
          balance: savingsBalance,
        },
        debtRatio: {
          score: debtRatioComponent,
          totalDebt,
        },
        paymentHistory: {
          score: paymentHistoryComponent,
        },
      },
      totalDebt,
      savingsBalance,
      recommendations,
    };
  }

  /**
   * Calculate credit repayment details
   */
  calculateRepaymentPlan(principal: number, interestRate: number, termMonths: number) {
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = termMonths;

    // Calculate monthly payment using amortization formula
    let monthlyPayment = 0;
    if (monthlyRate > 0) {
      monthlyPayment =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1);
    } else {
      monthlyPayment = principal / totalPayments;
    }

    const totalAmount = monthlyPayment * totalPayments;
    const totalInterest = totalAmount - principal;

    // Calculate breakdown for each month
    const paymentSchedule = [];
    let remainingBalance = principal;

    for (let month = 1; month <= totalPayments; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;

      paymentSchedule.push({
        month,
        payment: Number(monthlyPayment.toFixed(2)),
        principal: Number(principalPayment.toFixed(2)),
        interest: Number(interestPayment.toFixed(2)),
        remainingBalance: Number(Math.max(0, remainingBalance).toFixed(2)),
      });
    }

    return {
      principal,
      interestRate,
      termMonths,
      monthlyPayment: Number(monthlyPayment.toFixed(2)),
      totalAmount: Number(totalAmount.toFixed(2)),
      totalInterest: Number(totalInterest.toFixed(2)),
      paymentSchedule,
    };
  }

  private calculateCreditScoreComponent(creditScore: number): number {
    // Normalize credit score (300-850) to 0-100
    return Math.max(0, Math.min(100, ((creditScore - 300) / 550) * 100));
  }

  private calculateSavingsComponent(savingsBalance: number, totalDebt: number): number {
    if (totalDebt === 0) {
      // If no debt, savings component is based on absolute savings
      if (savingsBalance >= 10000) return 100;
      if (savingsBalance >= 5000) return 80;
      if (savingsBalance >= 1000) return 60;
      if (savingsBalance >= 500) return 40;
      return 20;
    }

    // Savings-to-debt ratio
    const ratio = savingsBalance / totalDebt;
    if (ratio >= 1) return 100; // Savings >= Debt
    if (ratio >= 0.5) return 75;
    if (ratio >= 0.25) return 50;
    if (ratio >= 0.1) return 30;
    return 10;
  }

  private calculateDebtRatioComponent(totalDebt: number, savingsBalance: number): number {
    if (totalDebt === 0) return 100;

    // Lower debt ratio = better score
    const avgMonthlyIncome = 5000; // Assume average
    const debtToIncomeRatio = totalDebt / (avgMonthlyIncome * 12);

    if (debtToIncomeRatio <= 0.2) return 100;
    if (debtToIncomeRatio <= 0.3) return 80;
    if (debtToIncomeRatio <= 0.4) return 60;
    if (debtToIncomeRatio <= 0.5) return 40;
    return 20;
  }

  private async calculatePaymentHistoryComponent(userId: string): number {
    // Get all completed credits
    const completedCredits = await this.creditRepository.findByUserId(userId);
    const completed = completedCredits.filter((c) => c.status === CreditStatus.COMPLETED);

    if (completed.length === 0) return 50; // Neutral if no history

    // Check if credits were paid on time (simplified)
    const onTimePayments = completed.filter((credit) => {
      const dueDate = credit.dueDate;
      const completedAt = credit.updatedAt;
      return dueDate && completedAt && completedAt <= dueDate;
    });

    return (onTimePayments.length / completed.length) * 100;
  }

  private getHealthStatus(score: number): string {
    if (score >= 80) return 'excellent';
    if (score >= 65) return 'good';
    if (score >= 50) return 'fair';
    if (score >= 35) return 'poor';
    return 'critical';
  }

  private generateRecommendations(
    creditScore: number,
    savingsBalance: number,
    totalDebt: number,
    healthScore: number,
  ): string[] {
    const recommendations: string[] = [];

    if (creditScore < 700) {
      recommendations.push(
        'Consider improving your credit score by making timely payments',
      );
    }

    if (savingsBalance < 1000) {
      recommendations.push(
        'Build an emergency fund - aim for at least 3 months of expenses',
      );
    }

    if (totalDebt > 0 && savingsBalance < totalDebt * 0.5) {
      recommendations.push('Focus on building savings while managing debt');
    }

    if (healthScore < 50) {
      recommendations.push('Create a budget and track your spending');
      recommendations.push('Consider consulting with a financial advisor');
    }

    if (recommendations.length === 0) {
      recommendations.push(
        'Keep up the good work! Maintain your current financial habits',
      );
    }

    return recommendations;
  }
}
