import { api } from '@/plugins/axios'
import { handleApiCall } from '@/lib/utils'
import type {
  SavingsAccountResponseDto,
  CreateSavingsAccountDto,
  DepositDto,
  WithdrawDto,
} from './index.dto'

export const getSavingsAccounts = async () => {
  return handleApiCall(async () => {
    const response = await api.get<SavingsAccountResponseDto[]>('/savings/accounts')
    return response.data
  })
}

export const getSavingsAccount = async (accountId: string) => {
  return handleApiCall(async () => {
    const response = await api.get<SavingsAccountResponseDto>(`/savings/accounts/${accountId}`)
    return response.data
  })
}

export const createSavingsAccount = async (payload: CreateSavingsAccountDto) => {
  return handleApiCall(async () => {
    const response = await api.post<SavingsAccountResponseDto>('/savings/accounts', payload)
    return response.data
  })
}

export const depositFunds = async (payload: DepositDto) => {
  return handleApiCall(async () => {
    const response = await api.post<SavingsAccountResponseDto>('/savings/deposit', payload)
    return response.data
  })
}

export const withdrawFunds = async (payload: WithdrawDto) => {
  return handleApiCall(async () => {
    const response = await api.post<SavingsAccountResponseDto>('/savings/withdraw', payload)
    return response.data
  })
}
