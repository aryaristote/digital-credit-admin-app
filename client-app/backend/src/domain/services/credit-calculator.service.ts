import { Money } from '../value-objects/money.vo';
import { CreditScore } from '../value-objects/credit-score.vo';

/**
 * Domain Service: Credit Calculator
 * Contains credit calculation logic that doesn't naturally fit in an entity
 */
export class CreditCalculatorService {
  /**
   * Calculate interest rate based on credit score
   */
  calculateInterestRate(creditScore: CreditScore): number {
    return creditScore.calculateInterestRate();
  }

  /**
   * Calculate monthly payment using amortization formula
   */
  calculateMonthlyPayment(
    principal: Money,
    annualInterestRate: number,
    termMonths: number,
  ): Money {
    const monthlyRate = annualInterestRate / 100 / 12;
    const totalPayments = termMonths;

    let monthlyPayment = 0;
    if (monthlyRate > 0) {
      monthlyPayment =
        (principal.amount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1);
    } else {
      monthlyPayment = principal.amount / totalPayments;
    }

    return Money.fromPrimitive(monthlyPayment);
  }

  /**
   * Calculate total interest over loan term
   */
  calculateTotalInterest(
    principal: Money,
    annualInterestRate: number,
    termMonths: number,
  ): Money {
    const monthlyPayment = this.calculateMonthlyPayment(
      principal,
      annualInterestRate,
      termMonths,
    );
    const totalAmount = monthlyPayment.multiply(termMonths);
    return totalAmount.subtract(principal);
  }

  /**
   * Generate payment schedule
   */
  generatePaymentSchedule(
    principal: Money,
    annualInterestRate: number,
    termMonths: number,
  ): PaymentScheduleItem[] {
    const monthlyRate = annualInterestRate / 100 / 12;
    const monthlyPayment = this.calculateMonthlyPayment(
      principal,
      annualInterestRate,
      termMonths,
    );

    const schedule: PaymentScheduleItem[] = [];
    let remainingBalance = principal.amount;

    for (let month = 1; month <= termMonths; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment.amount - interestPayment;
      remainingBalance -= principalPayment;

      schedule.push({
        month,
        payment: Money.fromPrimitive(monthlyPayment.amount),
        principal: Money.fromPrimitive(principalPayment),
        interest: Money.fromPrimitive(interestPayment),
        remainingBalance: Money.fromPrimitive(Math.max(0, remainingBalance)),
      });
    }

    return schedule;
  }

  /**
   * Calculate minimum repayment amount
   */
  calculateMinimumRepayment(principal: Money): Money {
    // Minimum is 1% of principal or 100, whichever is higher
    const onePercent = principal.multiply(0.01);
    const minimum = Money.fromPrimitive(100);
    return onePercent.isGreaterThan(minimum) ? onePercent : minimum;
  }
}

export interface PaymentScheduleItem {
  month: number;
  payment: Money;
  principal: Money;
  interest: Money;
  remainingBalance: Money;
}
