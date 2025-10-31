import { useQuery } from '@tanstack/react-query'
import type { ApiHandlerErrorResponseDto } from '@/types/auth.type'
import type { PaginatedResponse } from '@/types/pagination.type'
import type { TransactionResponseDto, TransactionFilters } from './index.dto'
import { getTransactions, getTransaction } from '.'

export const useGetTransactions = (filters?: TransactionFilters) => {
  return useQuery<PaginatedResponse<TransactionResponseDto>, ApiHandlerErrorResponseDto>({
    queryKey: ['transactions', filters],
    queryFn: () => getTransactions(filters),
  })
}

export const useGetTransaction = (reference: string) => {
  return useQuery<TransactionResponseDto, ApiHandlerErrorResponseDto>({
    queryKey: ['transaction', reference],
    queryFn: () => getTransaction(reference),
    enabled: !!reference,
  })
}
