import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createAccountSchema } from '../server/schema'
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
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useCreateSavingsAccount } from '../server/use-savings'
import { ESavingsAccountType } from '@/enums/financial.enum'

type CreateAccountDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateAccountDialog({ open, onOpenChange }: CreateAccountDialogProps) {
  const createMutation = useCreateSavingsAccount()

  const form = useForm<z.infer<typeof createAccountSchema>>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      accountType: ESavingsAccountType.REGULAR,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset()
    }
  }, [open, form])

  const onSubmit = (values: z.infer<typeof createAccountSchema>) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create Savings Account</DialogTitle>
              <DialogDescription>
                Choose the type of savings account you want to create
              </DialogDescription>
            </DialogHeader>

            <div className='space-y-4 py-4'>
              <FormField
                control={form.control}
                name='accountType'
                render={({ field }) => (
                  <FormItem className='space-y-3'>
                    <FormLabel>Account Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <div className='flex items-start space-x-3 rounded-lg border p-4'>
                          <RadioGroupItem value={ESavingsAccountType.REGULAR} id='regular' />
                          <div className='flex-1'>
                            <Label htmlFor='regular' className='font-medium cursor-pointer'>
                              Regular Account
                            </Label>
                            <p className='text-muted-foreground text-sm mt-1'>
                              Standard savings account with 5% interest rate. Ideal for everyday savings.
                            </p>
                          </div>
                        </div>

                        <div className='flex items-start space-x-3 rounded-lg border p-4'>
                          <RadioGroupItem value={ESavingsAccountType.PREMIUM} id='premium' />
                          <div className='flex-1'>
                            <Label htmlFor='premium' className='font-medium cursor-pointer'>
                              Premium Account
                            </Label>
                            <p className='text-muted-foreground text-sm mt-1'>
                              Enhanced savings account with higher limits and better benefits.
                            </p>
                          </div>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='rounded-lg bg-muted p-4 text-sm'>
                <p className='font-medium mb-2'>Note:</p>
                <ul className='text-muted-foreground space-y-1 text-xs'>
                  <li>• New accounts start with BASIC tier</li>
                  <li>• Tier can be upgraded based on account activity</li>
                  <li>• Interest is calculated daily</li>
                </ul>
              </div>
            </div>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={createMutation.isPending}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Account'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
