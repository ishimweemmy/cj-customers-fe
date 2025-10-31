import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/status-badge'
import { formatCurrency } from '@/lib/utils/format'
import { Wallet, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react'
import type { SavingsAccount } from '@/types/financial.type'
import { EAccountTier, EAccountStatus } from '@/enums/financial.enum'
import { cn } from '@/lib/utils'

type SavingsAccountCardProps = {
  account: SavingsAccount
  onDeposit: (account: SavingsAccount) => void
  onWithdraw: (account: SavingsAccount) => void
  onViewDetails: (account: SavingsAccount) => void
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

export function SavingsAccountCard({
  account,
  onDeposit,
  onWithdraw,
  onViewDetails,
}: SavingsAccountCardProps) {
  return (
    <Card className='overflow-hidden'>
      {/* Tier gradient header */}
      <div className={cn('h-2 bg-gradient-to-r', tierGradients[account.tier])} />

      <CardHeader className='space-y-4'>
        <div className='flex items-start justify-between'>
          <div className='flex items-center gap-2'>
            <div className={cn('rounded-lg p-2', tierBadgeColors[account.tier])}>
              <Wallet className='h-5 w-5' />
            </div>
            <div>
              <p className='text-xs text-muted-foreground'>Account Number</p>
              <p className='font-mono text-sm font-medium'>{account.accountNumber}</p>
            </div>
          </div>
          <StatusBadge status={account.status} />
        </div>

        <div>
          <p className='text-muted-foreground text-xs'>Balance</p>
          <p className='text-3xl font-bold'>{formatCurrency(account.balance)}</p>
        </div>

        <div className='grid grid-cols-2 gap-4 text-sm'>
          <div>
            <p className='text-muted-foreground text-xs'>Tier</p>
            <span className={cn('inline-flex items-center rounded-md px-2 py-1 text-xs font-medium', tierBadgeColors[account.tier])}>
              {account.tier}
            </span>
          </div>
          <div>
            <p className='text-muted-foreground text-xs'>Interest Rate</p>
            <p className='font-medium'>{account.interestRate}%</p>
          </div>
          <div className='col-span-2'>
            <p className='text-muted-foreground text-xs'>Account Type</p>
            <p className='font-medium'>{account.accountType}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-2'>
        <div className='grid grid-cols-3 gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => onViewDetails(account)}
            className='w-full'
          >
            Details
          </Button>
          <Button
            variant='default'
            size='sm'
            onClick={() => onDeposit(account)}
            className='w-full'
            disabled={account.status !== EAccountStatus.ACTIVE}
          >
            <ArrowDownToLine className='mr-1 h-4 w-4' />
            Deposit
          </Button>
          <Button
            variant='secondary'
            size='sm'
            onClick={() => onWithdraw(account)}
            className='w-full'
            disabled={account.status !== EAccountStatus.ACTIVE || account.balance === 0}
          >
            <ArrowUpFromLine className='mr-1 h-4 w-4' />
            Withdraw
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
