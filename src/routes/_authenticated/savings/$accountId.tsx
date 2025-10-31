import { createFileRoute } from '@tanstack/react-router'
import { SavingsAccountDetails } from '@/features/savings/account-details'

export const Route = createFileRoute('/_authenticated/savings/$accountId')({
  component: SavingsAccountDetails,
})
