import { Wallet, CreditCard, Banknote, TrendingUp } from 'lucide-react'
import { StatCard } from '@/components/shared/stat-card'
import { formatCurrency, getCreditScoreRating } from '@/lib/utils/format'
import type { TUser } from '@/types/auth.type'
import type { CreditAccount } from '@/types/financial.type'

type DashboardStatsProps = {
  user: TUser | undefined
  creditAccount: CreditAccount | undefined
  totalSavings: number
  activeLoansCount: number
  isLoading: boolean
}

export function DashboardStats({
  user,
  creditAccount,
  totalSavings,
  activeLoansCount,
  isLoading,
}: DashboardStatsProps) {
  const creditScoreRating = user
    ? getCreditScoreRating(user.creditScore)
    : null

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      <StatCard
        title='Total Savings'
        value={formatCurrency(totalSavings)}
        icon={Wallet}
        isLoading={isLoading}
      />
      <StatCard
        title='Available Credit'
        value={formatCurrency(creditAccount?.availableCredit || 0)}
        description={`of ${formatCurrency(creditAccount?.creditLimit || 0)}`}
        icon={CreditCard}
        isLoading={isLoading}
      />
      <StatCard
        title='Active Loans'
        value={activeLoansCount}
        description={
          creditAccount?.outstandingBalance
            ? `${formatCurrency(creditAccount.outstandingBalance)} outstanding`
            : undefined
        }
        icon={Banknote}
        isLoading={isLoading}
      />
      <StatCard
        title='Credit Score'
        value={user?.creditScore || 0}
        description={creditScoreRating?.label}
        icon={TrendingUp}
        isLoading={isLoading}
      />
    </div>
  )
}
