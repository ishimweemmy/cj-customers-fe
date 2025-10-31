import { createFileRoute } from '@tanstack/react-router'
import { Savings } from '@/features/savings'

export const Route = createFileRoute('/_authenticated/savings/')({
  component: Savings,
})
