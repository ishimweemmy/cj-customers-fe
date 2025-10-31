import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { repayLoanSchema } from '../server/schema'
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
  FormDescription,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/utils/format'
import { useRepayLoan } from '../server/use-loans'
import { useGetSavingsAccounts } from '@/features/savings/server/use-savings'
import { EAccountStatus } from '@/enums/financial.enum'
import type { Loan } from '@/types/financial.type'

type RepayLoanDialogProps = {
  loan: Loan | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RepayLoanDialog({ loan, open, onOpenChange }: RepayLoanDialogProps) {
  const repayMutation = useRepayLoan()
  const { data: accounts } = useGetSavingsAccounts()

  const activeAccounts = accounts?.filter(acc => acc.status === EAccountStatus.ACTIVE)

  const form = useForm<z.infer<typeof repayLoanSchema>>({
    resolver: zodResolver(repayLoanSchema),
    defaultValues: {
      loanId: '',
      amount: 0,
      savingsAccountId: '',
    },
  })

  useEffect(() => {
    if (open && loan) {
      form.reset({
        loanId: loan.id,
        amount: 0,
        savingsAccountId: activeAccounts && activeAccounts.length === 1 ? activeAccounts[0].id : '',
      })
    }
  }, [open, loan, form])

  const onSubmit = (values: z.infer<typeof repayLoanSchema>) => {
    repayMutation.mutate(values, {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    })
  }

  if (!loan) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Repay Loan</DialogTitle>
              <DialogDescription>
                Make a payment towards loan {loan.loanNumber}
              </DialogDescription>
            </DialogHeader>

            <div className='space-y-4 py-4'>
              <div className='rounded-lg bg-muted p-4 space-y-2'>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-muted-foreground'>Outstanding Balance</span>
                  <span className='font-semibold'>{formatCurrency(loan.outstandingAmount)}</span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-muted-foreground'>Total Amount</span>
                  <span className='font-semibold'>{formatCurrency(loan.totalAmount)}</span>
                </div>
              </div>

              <FormField
                control={form.control}
                name='amount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repayment Amount (RWF)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='0'
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum: {formatCurrency(loan.outstandingAmount)}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {activeAccounts && activeAccounts.length > 0 && (
                <FormField
                  control={form.control}
                  name='savingsAccountId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Account{activeAccounts.length > 1 ? '' : ' (Optional)'}</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select account' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {activeAccounts.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.accountNumber} - {formatCurrency(account.balance)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Account to deduct payment from
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={repayMutation.isPending}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={repayMutation.isPending}>
                {repayMutation.isPending ? 'Processing...' : 'Submit Payment'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
