import type { SavingsAccount } from '@/types/financial.type'
import type { ESavingsAccountType } from '@/enums/financial.enum'

export type CreateSavingsAccountDto = {
  accountType: ESavingsAccountType
}

export type DepositDto = {
  savingsAccountId: string
  amount: number
  description?: string
}

export type WithdrawDto = {
  savingsAccountId: string
  amount: number
  description?: string
}

export type SavingsAccountResponseDto = SavingsAccount
