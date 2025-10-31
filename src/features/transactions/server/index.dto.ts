import type { Transaction } from '@/types/financial.type'
import type { ETransactionType, ETransactionStatus } from '@/enums/financial.enum'

export type TransactionFilters = {
  type?: ETransactionType
  status?: ETransactionStatus
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
  savingsAccountId?: string
}

export type TransactionResponseDto = Transaction
