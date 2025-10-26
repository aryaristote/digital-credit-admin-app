// ... existing code ...

  async getUserCredits(userId: string): Promise<CreditRequestResponseDto[]> {
    const credits = await this.creditRepository.findByUserId(userId);
    return credits.map((credit) => this.toCreditRequestResponseDto(credit));
  }

  async getCreditDetails(
    creditRequestId: string,
    userId: string,
  ): Promise<CreditRequestResponseDto> {
    const creditRequest = await this.creditRepository.findById(creditRequestId);

    if (!creditRequest) {
      throw new NotFoundException('Credit request not found');
    }

    if (creditRequest.userId !== userId) {
      throw new BadRequestException('Unauthorized access to credit request');
    }

    return this.toCreditRequestResponseDto(creditRequest);
  }

  // ... existing code ...
