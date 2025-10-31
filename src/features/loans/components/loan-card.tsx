import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { StatusBadge } from '@/components/shared/status-badge'
import { formatCurrency, formatDate, calculatePercentage } from '@/lib/utils/format'
import { Banknote, Eye, Wallet } from 'lucide-react'
import type { Loan } from '@/types/financial.type'
import { ELoanStatus } from '@/enums/financial.enum'
import { cn } from '@/lib/utils'

type LoanCardProps = {
  loan: Loan
  onViewDetails: (loan: Loan) => void
  onRepay?: (loan: Loan) => void
}

export function LoanCard({ loan, onViewDetails, onRepay }: LoanCardProps) {
  const progress = calculatePercentage(
    loan.totalAmount - loan.outstandingAmount,
    loan.totalAmount
  )

  const canRepay =
    loan.status === ELoanStatus.ACTIVE || loan.status === ELoanStatus.DISBURSED

  const isOverdue = loan.status === ELoanStatus.ACTIVE && new Date(loan.dueDate) < new Date()

  return (
    <Card className='overflow-hidden'>
      <CardHeader className='space-y-4'>
        <div className='flex items-start justify-between'>
          <div className='flex items-center gap-2'>
            <div className='bg-primary/10 rounded-lg p-2'>
              <Banknote className='h-5 w-5 text-primary' />
            </div>
            <div>
              <p className='text-xs text-muted-foreground'>Loan Number</p>
              <p className='font-mono text-sm font-medium'>{loan.loanNumber}</p>
            </div>
          </div>
          <div className='flex flex-col gap-1 items-end'>
            <StatusBadge status={loan.status} />
            <StatusBadge status={loan.approvalStatus} className='text-xs' />
          </div>
        </div>

        <div>
          <p className='text-muted-foreground text-xs'>Outstanding Balance</p>
          <p className={cn(
            'text-3xl font-bold',
            isOverdue && 'text-destructive'
          )}>
            {formatCurrency(loan.outstandingAmount)}
          </p>
          <p className='text-muted-foreground text-xs mt-1'>
            of {formatCurrency(loan.totalAmount)}
          </p>
        </div>

        {/* Progress Bar */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between text-xs'>
            <span className='text-muted-foreground'>Repayment Progress</span>
            <span className='font-medium'>{progress.toFixed(0)}%</span>
          </div>
          <Progress value={progress} className='h-2' />
        </div>

        <div className='grid grid-cols-2 gap-4 text-sm'>
          <div>
            <p className='text-muted-foreground text-xs'>Principal</p>
            <p className='font-medium'>{formatCurrency(loan.principalAmount)}</p>
          </div>
          <div>
            <p className='text-muted-foreground text-xs'>Interest Rate</p>
            <p className='font-medium'>{loan.interestRate}%</p>
          </div>
          <div>
            <p className='text-muted-foreground text-xs'>Tenor</p>
            <p className='font-medium'>{loan.tenorMonths} months</p>
          </div>
          <div>
            <p className='text-muted-foreground text-xs'>Due Date</p>
            <p className={cn(
              'font-medium text-xs',
              isOverdue && 'text-destructive'
            )}>
              {formatDate(loan.dueDate, 'PP')}
            </p>
          </div>
        </div>

        {loan.purpose && (
          <div>
            <p className='text-muted-foreground text-xs'>Purpose</p>
            <p className='text-sm'>{loan.purpose}</p>
          </div>
        )}
      </CardHeader>

      <CardContent className='space-y-2'>
        <div className='grid grid-cols-2 gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => onViewDetails(loan)}
            className='w-full'
          >
            <Eye className='mr-1 h-4 w-4' />
            Details
          </Button>
          {canRepay && onRepay && (
            <Button
              variant='default'
              size='sm'
              onClick={() => onRepay(loan)}
              className='w-full'
            >
              <Wallet className='mr-1 h-4 w-4' />
              Repay
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
