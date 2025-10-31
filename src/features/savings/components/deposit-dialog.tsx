import { useEffect } from 'react'
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
import { useDeposit } from '../server/use-savings'
import { TIER_LIMITS } from '@/lib/constants/financial.constants'
import type { SavingsAccount } from '@/types/financial.type'

type DepositDialogProps = {
  account: SavingsAccount | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DepositDialog({ account, open, onOpenChange }: DepositDialogProps) {
  const depositMutation = useDeposit()
  const dailyLimit = account ? TIER_LIMITS[account.tier].dailyDeposit : 0

  const depositSchema = z.object({
    amount: z.number().min(1, 'Amount must be at least 1 RWF').max(dailyLimit, `Amount exceeds daily limit of ${formatCurrency(dailyLimit)}`),
    description: z.string().optional(),
  })

  const form = useForm<z.infer<typeof depositSchema>>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      amount: 0,
      description: '',
    },
  })

  useEffect(() => {
    if (open) {
      form.reset()
    }
  }, [open, form])

  const onSubmit = (values: z.infer<typeof depositSchema>) => {
    if (!account) return

    depositMutation.mutate(
      {
        savingsAccountId: account.id,
        ...values,
      },
      {
        onSuccess: () => {
          form.reset()
          onOpenChange(false)
        },
      }
    )
  }

  if (!account) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Deposit Funds</DialogTitle>
              <DialogDescription>
                Deposit money to your savings account {account.accountNumber}
              </DialogDescription>
            </DialogHeader>

            <div className='space-y-4 py-4'>
              <div className='rounded-lg bg-muted p-4'>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-muted-foreground'>Current Balance</span>
                  <span className='font-semibold'>{formatCurrency(account.balance)}</span>
                </div>
                <div className='mt-2 flex items-center justify-between text-sm'>
                  <span className='text-muted-foreground'>Daily Limit</span>
                  <span className='font-semibold'>{formatCurrency(dailyLimit)}</span>
                </div>
              </div>

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
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
                        placeholder='e.g., Monthly savings'
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
                onClick={() => onOpenChange(false)}
                disabled={depositMutation.isPending}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={depositMutation.isPending}>
                {depositMutation.isPending ? 'Processing...' : 'Deposit'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
