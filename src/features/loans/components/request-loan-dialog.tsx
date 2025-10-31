import { useEffect } from 'react'
import type { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Info } from 'lucide-react'
import {
  LOAN_TENOR_OPTIONS,
  AUTO_APPROVAL_THRESHOLD,
} from '@/lib/constants/financial.constants'
import { formatCurrency, calculateLoanTotal } from '@/lib/utils/format'
import type { LoanTenorMonths } from '@/types/financial.type'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
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
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useGetSavingsAccounts } from '@/features/savings/server/use-savings'
import { loanRequestSchema } from '../server/schema'
import { useRequestLoan } from '../server/use-loans'

type RequestLoanDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RequestLoanDialog({
  open,
  onOpenChange,
}: RequestLoanDialogProps) {
  const requestMutation = useRequestLoan()
  const { data: accounts } = useGetSavingsAccounts()

  const form = useForm<z.infer<typeof loanRequestSchema>>({
    resolver: zodResolver(loanRequestSchema),
    defaultValues: {
      principalAmount: 0,
      tenorMonths: 6,
      purpose: '',
      savingsAccountId: '',
    },
  })

  const principalAmount = form.watch('principalAmount')
  const tenorMonths = form.watch('tenorMonths')

  const calculation =
    principalAmount > 0 && tenorMonths
      ? calculateLoanTotal(principalAmount, tenorMonths as LoanTenorMonths)
      : null

  const willAutoApprove =
    principalAmount > 0 && principalAmount <= AUTO_APPROVAL_THRESHOLD

  useEffect(() => {
    if (open) {
      form.reset()
      if (accounts && accounts.length === 1) {
        form.setValue('savingsAccountId', accounts[0].id)
      }
    }
  }, [open, form, accounts])

  const onSubmit = (values: z.infer<typeof loanRequestSchema>) => {
    requestMutation.mutate(values, {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Request Loan</DialogTitle>
              <DialogDescription>
                Fill in the details below to request a loan
              </DialogDescription>
            </DialogHeader>

            <div className='space-y-4 py-4'>
              <FormField
                control={form.control}
                name='principalAmount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Amount (RWF)</FormLabel>
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
                name='tenorMonths'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repayment Period</FormLabel>
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) =>
                        field.onChange(Number(value) as LoanTenorMonths)
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select period' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LOAN_TENOR_OPTIONS.map((tenor) => (
                          <SelectItem key={tenor} value={tenor.toString()}>
                            {tenor} months
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {calculation && (
                <div className='bg-muted space-y-2 rounded-lg p-4'>
                  <p className='text-sm font-medium'>Loan Summary</p>
                  <div className='grid grid-cols-2 gap-2 text-sm'>
                    <div>
                      <p className='text-muted-foreground text-xs'>
                        Interest Rate
                      </p>
                      <p className='font-semibold'>
                        {calculation.interestRate}%
                      </p>
                    </div>
                    <div>
                      <p className='text-muted-foreground text-xs'>
                        Interest Amount
                      </p>
                      <p className='font-semibold'>
                        {formatCurrency(calculation.interestAmount)}
                      </p>
                    </div>
                    <div>
                      <p className='text-muted-foreground text-xs'>
                        Total Amount
                      </p>
                      <p className='font-semibold'>
                        {formatCurrency(calculation.totalAmount)}
                      </p>
                    </div>
                    <div>
                      <p className='text-muted-foreground text-xs'>
                        Monthly Payment
                      </p>
                      <p className='font-semibold'>
                        {formatCurrency(calculation.monthlyInstallment)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {willAutoApprove && (
                <Alert>
                  <Info className='h-4 w-4' />
                  <AlertDescription>
                    This loan will be auto-approved and disbursed immediately
                    upon submission.
                  </AlertDescription>
                </Alert>
              )}

              {accounts && accounts.length > 1 && (
                <FormField
                  control={form.control}
                  name='savingsAccountId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Disbursement Account (Optional)</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select account' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {accounts.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.accountNumber} -{' '}
                              {formatCurrency(account.balance)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Loan will be disbursed to this account
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name='purpose'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purpose (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='e.g., Business expansion, Education, etc.'
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
                disabled={requestMutation.isPending}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={requestMutation.isPending}>
                {requestMutation.isPending ? 'Submitting...' : 'Request Loan'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
