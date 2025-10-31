import type { TUser } from '@/types/auth.type'
import type { CreditAccount, Transaction } from '@/types/financial.type'

export type DashboardStatsDto = {
  totalSavings: number
  availableCredit: number
  activeLoansCount: number
  totalOutstanding: number
  creditScore: number
}

export type DashboardDataDto = {
  user: TUser
  creditAccount: CreditAccount
  stats: DashboardStatsDto
  recentTransactions: Transaction[]
}
