import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { StatusBadge } from '@/components/shared/status-badge'
import { formatCurrency, formatPercentage, calculatePercentage } from '@/lib/utils/format'
import type { CreditAccount } from '@/types/financial.type'
import { CreditCard, TrendingUp, TrendingDown, Wallet } from 'lucide-react'

type CreditStatsProps = {
  creditAccount: CreditAccount
}

export function CreditStats({ creditAccount }: CreditStatsProps) {
  const utilization = calculatePercentage(
    creditAccount.outstandingBalance,
    creditAccount.creditLimit
  )

  const getUtilizationColor = (percent: number) => {
    if (percent >= 80) return 'text-red-600'
    if (percent >= 50) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className='space-y-6'>
      {/* Account Header */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='text-lg'>Credit Account</CardTitle>
              <p className='text-muted-foreground text-sm font-mono'>
                {creditAccount.accountNumber}
              </p>
            </div>
            <StatusBadge status={creditAccount.status} />
          </div>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Credit Limit</CardTitle>
            <CreditCard className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{formatCurrency(creditAccount.creditLimit)}</div>
            <p className='text-muted-foreground text-xs'>Maximum credit available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Available Credit</CardTitle>
            <Wallet className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>
              {formatCurrency(creditAccount.availableCredit)}
            </div>
            <p className='text-muted-foreground text-xs'>Ready to borrow</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Outstanding Balance</CardTitle>
            <TrendingDown className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-red-600'>
              {formatCurrency(creditAccount.outstandingBalance)}
            </div>
            <p className='text-muted-foreground text-xs'>Current debt</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Borrowed</CardTitle>
            <TrendingUp className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{formatCurrency(creditAccount.totalBorrowed)}</div>
            <p className='text-muted-foreground text-xs'>
              Repaid: {formatCurrency(creditAccount.totalRepaid)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Utilization Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Credit Utilization</CardTitle>
          <p className='text-muted-foreground text-sm'>
            Percentage of credit limit currently in use
          </p>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium'>Utilization Rate</span>
            <span className={`text-2xl font-bold ${getUtilizationColor(utilization)}`}>
              {formatPercentage(utilization)}
            </span>
          </div>
          <Progress value={utilization} className='h-4' />
          <div className='flex justify-between text-xs text-muted-foreground'>
            <span>{formatCurrency(creditAccount.outstandingBalance)} used</span>
            <span>{formatCurrency(creditAccount.availableCredit)} available</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
