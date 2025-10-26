// ... existing code up to line 180 ...

  async getTransactions(userId: string, limit: number = 10): Promise<TransactionResponseDto[]> {
    const account = await this.savingsRepository.findByUserId(userId);
    if (!account) {
      throw new NotFoundException('Savings account not found');
    }

    const transactions = await this.savingsRepository.getTransactions(account.id, limit);
    return transactions.map((tx) => this.toTransactionResponseDto(tx));
  }

  // ... rest of existing code ...
