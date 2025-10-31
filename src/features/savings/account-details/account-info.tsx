import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/status-badge'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import { Wallet } from 'lucide-react'
import type { SavingsAccount } from '@/types/financial.type'
import { EAccountTier } from '@/enums/financial.enum'
import { cn } from '@/lib/utils'

type AccountInfoProps = {
  account: SavingsAccount
}

const tierGradients = {
  [EAccountTier.BASIC]: 'from-gray-500 to-gray-600',
  [EAccountTier.SILVER]: 'from-slate-400 to-slate-500',
  [EAccountTier.GOLD]: 'from-yellow-500 to-yellow-600',
  [EAccountTier.PLATINUM]: 'from-purple-500 to-purple-600',
}

const tierBadgeColors = {
  [EAccountTier.BASIC]: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
  [EAccountTier.SILVER]: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100',
  [EAccountTier.GOLD]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  [EAccountTier.PLATINUM]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
}

export function AccountInfo({ account }: AccountInfoProps) {
  return (
    <Card className='overflow-hidden'>
      <div className={cn('h-2 bg-gradient-to-r', tierGradients[account.tier])} />
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className={cn('rounded-lg p-2', tierBadgeColors[account.tier])}>
              <Wallet className='h-6 w-6' />
            </div>
            <div>
              <CardTitle>Savings Account</CardTitle>
              <p className='font-mono text-sm text-muted-foreground'>{account.accountNumber}</p>
            </div>
          </div>
          <StatusBadge status={account.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
          <div>
            <p className='text-xs text-muted-foreground'>Current Balance</p>
            <p className='text-2xl font-bold'>{formatCurrency(account.balance)}</p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>Account Tier</p>
            <span className={cn('inline-flex items-center rounded-md px-2 py-1 text-sm font-medium', tierBadgeColors[account.tier])}>
              {account.tier}
            </span>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>Interest Rate</p>
            <p className='text-xl font-semibold'>{account.interestRate}%</p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>Account Type</p>
            <p className='text-sm font-medium'>{account.accountType}</p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>Created Date</p>
            <p className='text-sm font-medium'>{formatDate(account.createdAt)}</p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>Last Updated</p>
            <p className='text-sm font-medium'>{formatDate(account.updatedAt)}</p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>Last Interest Calc</p>
            <p className='text-sm font-medium'>
              {account.lastInterestCalculationDate
                ? formatDate(account.lastInterestCalculationDate)
                : 'Not yet calculated'}
            </p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>Currency</p>
            <p className='text-sm font-medium'>{account.currency}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
