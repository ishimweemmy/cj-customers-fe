import type { Loan, RepaymentSchedule, LoanTenorMonths } from '@/types/financial.type'

export type LoanRequestDto = {
  principalAmount: number
  tenorMonths: LoanTenorMonths
  purpose?: string
  savingsAccountId?: string
}

export type RepayLoanDto = {
  loanId: string
  amount: number
  savingsAccountId?: string
}

export type LoanResponseDto = Loan

export type RepaymentResponseDto = {
  message: string
  repaymentId: string
}

export type RepaymentScheduleResponseDto = RepaymentSchedule
