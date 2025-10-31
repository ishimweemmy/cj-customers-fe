import { useAuthStore } from '@/stores/auth-store'
import { useGetCreditAccount } from '@/features/credit/server/use-credit'
import { useGetTransactions } from '@/features/transactions/server/use-transactions'
import { useGetSavingsAccounts } from '@/features/savings/server/use-savings'
import { useGetLoans } from '@/features/loans/server/use-loans'
import type { SavingsAccount, Loan } from '@/types/financial.type'
import { ELoanStatus } from '@/enums/financial.enum'

// Helper to calculate total savings from accounts
export const calculateTotalSavings = (accounts: SavingsAccount[]): number => {
  return accounts.reduce((total, account) => total + account.balance, 0)
}

// Helper to count active loans
export const countActiveLoans = (loans: Loan[]): number => {
  return loans.filter(
    (loan) =>
      loan.status === ELoanStatus.ACTIVE ||
      loan.status === ELoanStatus.DISBURSED ||
      loan.status === ELoanStatus.APPROVED
  ).length
}

// Combined hook for dashboard data - reuses hooks from other features
export const useDashboardData = () => {
  const user = useAuthStore((state) => state.auth.user)
  const creditAccount = useGetCreditAccount()
  const recentTransactions = useGetTransactions({ limit: 10 })
  const savingsAccounts = useGetSavingsAccounts()
  const loans = useGetLoans()

  const totalSavings = savingsAccounts.data
    ? calculateTotalSavings(savingsAccounts.data)
    : 0

  const activeLoansCount = loans.data ? countActiveLoans(loans.data) : 0

  const isLoading =
    creditAccount.isLoading ||
    recentTransactions.isLoading ||
    savingsAccounts.isLoading ||
    loans.isLoading

  return {
    user,
    creditAccount: creditAccount.data,
    transactions: recentTransactions.data?.data || [],
    totalSavings,
    activeLoansCount,
    isLoading,
  }
}
