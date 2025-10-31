import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiHandlerErrorResponseDto } from '@/types/auth.type'
import type {
  SavingsAccountResponseDto,
  CreateSavingsAccountDto,
  DepositDto,
  WithdrawDto,
} from './index.dto'
import {
  getSavingsAccounts,
  getSavingsAccount,
  createSavingsAccount,
  depositFunds,
  withdrawFunds,
} from '.'

export const useGetSavingsAccounts = () => {
  return useQuery<SavingsAccountResponseDto[], ApiHandlerErrorResponseDto>({
    queryKey: ['savings-accounts'],
    queryFn: getSavingsAccounts,
  })
}

export const useGetSavingsAccount = (accountId: string) => {
  return useQuery<SavingsAccountResponseDto, ApiHandlerErrorResponseDto>({
    queryKey: ['savings-account', accountId],
    queryFn: () => getSavingsAccount(accountId),
    enabled: !!accountId,
  })
}

export const useCreateSavingsAccount = () => {
  const queryClient = useQueryClient()

  return useMutation<
    SavingsAccountResponseDto,
    ApiHandlerErrorResponseDto,
    CreateSavingsAccountDto
  >({
    mutationFn: createSavingsAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-accounts'] })
      toast.success('Account created successfully')
    },
    onError: (error) => {
      toast.error(error.meta?.message || 'Failed to create account')
    },
  })
}

export const useDeposit = () => {
  const queryClient = useQueryClient()

  return useMutation<
    SavingsAccountResponseDto,
    ApiHandlerErrorResponseDto,
    DepositDto
  >({
    mutationFn: depositFunds,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['savings-accounts'] })
      queryClient.invalidateQueries({
        queryKey: ['savings-account', variables.savingsAccountId],
      })
      queryClient.invalidateQueries({ queryKey: ['recent-transactions'] })
      toast.success('Deposit successful')
    },
    onError: (error) => {
      toast.error(error.meta?.message || 'Deposit failed')
    },
  })
}

export const useWithdraw = () => {
  const queryClient = useQueryClient()

  return useMutation<
    SavingsAccountResponseDto,
    ApiHandlerErrorResponseDto,
    WithdrawDto
  >({
    mutationFn: withdrawFunds,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['savings-accounts'] })
      queryClient.invalidateQueries({
        queryKey: ['savings-account', variables.savingsAccountId],
      })
      queryClient.invalidateQueries({ queryKey: ['recent-transactions'] })
      toast.success('Withdrawal successful')
    },
    onError: (error) => {
      toast.error(error.meta?.message || 'Withdrawal failed')
    },
  })
}
