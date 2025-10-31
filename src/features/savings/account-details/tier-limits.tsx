import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TIER_LIMITS } from '@/lib/constants/financial.constants'
import { formatCurrency } from '@/lib/utils/format'
import type { EAccountTier } from '@/enums/financial.enum'
import { TrendingDown, TrendingUp } from 'lucide-react'

type TierLimitsProps = {
  tier: EAccountTier
}

export function TierLimits({ tier }: TierLimitsProps) {
  const limits = TIER_LIMITS[tier]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tier Limits</CardTitle>
        <p className='text-sm text-muted-foreground'>
          Your {tier} tier account limits and benefits
        </p>
      </CardHeader>
      <CardContent>
        <div className='grid gap-4 md:grid-cols-2'>
          <div className='space-y-2 rounded-lg border p-4'>
            <div className='flex items-center gap-2'>
              <TrendingUp className='h-4 w-4 text-green-600' />
              <p className='text-sm font-medium'>Deposit Limits</p>
            </div>
            <div className='space-y-1'>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Daily Limit:</span>
                <span className='font-semibold'>{formatCurrency(limits.dailyDeposit)}</span>
              </div>
            </div>
          </div>

          <div className='space-y-2 rounded-lg border p-4'>
            <div className='flex items-center gap-2'>
              <TrendingDown className='h-4 w-4 text-red-600' />
              <p className='text-sm font-medium'>Withdrawal Limits</p>
            </div>
            <div className='space-y-1'>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Daily Limit:</span>
                <span className='font-semibold'>{formatCurrency(limits.dailyWithdrawal)}</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Monthly Limit:</span>
                <span className='font-semibold'>{formatCurrency(limits.monthlyWithdrawal)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
