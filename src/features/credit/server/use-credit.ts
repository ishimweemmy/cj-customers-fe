import { useQuery } from '@tanstack/react-query'
import type { ApiHandlerErrorResponseDto } from '@/types/auth.type'
import type { CreditAccountResponseDto } from './index.dto'
import { getCreditAccount } from '.'

export const useGetCreditAccount = () => {
  return useQuery<CreditAccountResponseDto, ApiHandlerErrorResponseDto>({
    queryKey: ['credit-account'],
    queryFn: getCreditAccount,
  })
}
