import { z } from 'zod'
import { ESavingsAccountType } from '@/enums/financial.enum'

export const createAccountSchema = z.object({
  accountType: z.nativeEnum(ESavingsAccountType),
})

export const depositSchema = z.object({
  savingsAccountId: z.string().min(1, 'Please select an account'),
  amount: z.number().min(1, 'Amount must be at least 1 RWF'),
  description: z.string().optional(),
})

export const withdrawSchema = z.object({
  savingsAccountId: z.string().min(1, 'Please select an account'),
  amount: z.number().min(1, 'Amount must be at least 1 RWF'),
  description: z.string().optional(),
})
