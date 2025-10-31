import { api } from '@/plugins/axios'
import { handleApiCall } from '@/lib/utils'
import type { PaginatedResponse } from '@/types/pagination.type'
import type { TransactionResponseDto, TransactionFilters } from './index.dto'

export const getTransactions = async (filters?: TransactionFilters) => {
  return handleApiCall(async () => {
    const response = await api.get<PaginatedResponse<TransactionResponseDto>>('/transaction/history', {
      params: filters,
    })
    return response.data
  })
}

export const getTransaction = async (reference: string) => {
  return handleApiCall(async () => {
    const response = await api.get<TransactionResponseDto>(`/transaction/${reference}`)
    return response.data
  })
}
