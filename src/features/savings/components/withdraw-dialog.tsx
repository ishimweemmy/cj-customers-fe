import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { formatCurrency } from '@/lib/utils/format'
import { useWithdraw } from '../server/use-savings'
import { TIER_LIMITS } from '@/lib/constants/financial.constants'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { SavingsAccount } from '@/types/financial.type'

type WithdrawDialogProps = {
  account: SavingsAccount | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WithdrawDialog({ account, open, onOpenChange }: WithdrawDialogProps) {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const withdrawMutation = useWithdraw()

  const dailyLimit = account ? TIER_LIMITS[account.tier].dailyWithdrawal : 0
  const maxWithdraw = account ? Math.min(account.balance, dailyLimit) : 0

  const withdrawSchema = z.object({
    amount: z.number().min(1, 'Amount must be at least 1 RWF').max(maxWithdraw, `Amount exceeds maximum withdrawal of ${formatCurrency(maxWithdraw)}`),
    description: z.string().optional(),
  })

  const form = useForm<z.infer<typeof withdrawSchema>>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      amount: 0,
      description: '',
    },
  })

  useEffect(() => {
    if (open) {
      form.reset()
      setShowConfirmation(false)
    }
  }, [open, form])

  const onSubmit = (values: z.infer<typeof withdrawSchema>) => {
    if (!account) return

    if (!showConfirmation) {
      setShowConfirmation(true)
      return
    }

    withdrawMutation.mutate(
      {
        savingsAccountId: account.id,
        ...values,
      },
      {
        onSuccess: () => {
          form.reset()
          setShowConfirmation(false)
          onOpenChange(false)
        },
      }
    )
  }

  const handleClose = () => {
    form.reset()
    setShowConfirmation(false)
    onOpenChange(false)
  }

  if (!account) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Withdraw Funds</DialogTitle>
              <DialogDescription>
                Withdraw money from your savings account {account.accountNumber}
              </DialogDescription>
            </DialogHeader>

            <div className='space-y-4 py-4'>
              <div className='rounded-lg bg-muted p-4 space-y-2'>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-muted-foreground'>Current Balance</span>
                  <span className='font-semibold'>{formatCurrency(account.balance)}</span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-muted-foreground'>Max Withdrawal</span>
                  <span className='font-semibold'>{formatCurrency(maxWithdraw)}</span>
                </div>
              </div>

              {showConfirmation && (
                <Alert>
                  <AlertCircle className='h-4 w-4' />
                  <AlertDescription>
                    You are about to withdraw {formatCurrency(form.getValues('amount'))}. Click Confirm to proceed.
                  </AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name='amount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (RWF)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='0'
                        {...field}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value))
                          setShowConfirmation(false)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='e.g., Emergency expense'
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={handleClose}
                disabled={withdrawMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                variant={showConfirmation ? 'destructive' : 'default'}
                disabled={withdrawMutation.isPending}
              >
                {withdrawMutation.isPending
                  ? 'Processing...'
                  : showConfirmation
                    ? 'Confirm Withdrawal'
                    : 'Withdraw'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
